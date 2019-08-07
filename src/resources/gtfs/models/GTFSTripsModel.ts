import { CustomError } from "golemio-errors";
import { RopidGTFS } from "golemio-schema-definitions";
import { sequelizeConnection } from "../../../core/database";
import { buildGeojsonFeature } from "../../../core/Geo";
import { log } from "../../../core/Logger";
import { SequelizeModel } from "../../../core/models";

export class GTFSTripsModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.trips.name, RopidGTFS.trips.pgTableName, RopidGTFS.trips.outputSequelizeAttributes);
    }

    public Associate = (models: any) => {

        this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
            as: "has_stop_id",
            foreignKey: "trip_id",
        });

        this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
            as: "stop_times",
            foreignKey: "trip_id",
        });

        this.sequelizeModel.belongsTo(models.GTFSCalendarModel.sequelizeModel, {
            as: "service",
            foreignKey: "service_id",
        });

        this.sequelizeModel.belongsTo(models.GTFSRoutesModel.sequelizeModel, {
            as: "route",
            foreignKey: "route_id",
        });

        this.sequelizeModel.hasMany(models.GTFSShapesModel.sequelizeModel, {
            as: "shapes",
            foreignKey: "shape_id",
            sourceKey: "shape_id",
        });

        this.sequelizeModel.belongsToMany(models.GTFSStopModel.sequelizeModel, {
            as: "stops",
            foreignKey: "trip_id",
            otherKey: "stop_id",
            through: models.GTFSStopTimesModel.sequelizeModel,
        });
    }

    /** Retrieves all gtfs trips
     * @param {object} options Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {boolean} [options.route] Enhance response with route data
     * @param {string} [options.stopId] Filter routes by specific stop
     * @param {string} [options.date] Filter by specific date in the 'YYYY-MM-DD' format
     * @returns Array of the retrieved records
     */
    public GetAll = async (options:
        {
            limit?: number,
            offset?: number,
            stopId?: string,
            date?: string,
        } = {},
    ): Promise<any> => {
        const { limit, offset, stopId, date } = options;
        try {
            const include: any = [];
            if (stopId) {
                include.push({
                    as: "has_stop_id",
                    attributes: [],
                    duplicating: false,
                    model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
                    where: {
                        stop_id: stopId,
                    },
                });
            }

            if (date) {
                include.push({
                    as: "service",
                    attributes: [],
                    model: sequelizeConnection.models[RopidGTFS.calendar.pgTableName]
                        .scope({ method: ["forDate", date] }),
                });
            }

            const data = await this.sequelizeModel.findAll({
                include,
                limit,
                offset,
                order: [["trip_id", "DESC"]],
            });

            return data;

        } catch (err) {
            throw new CustomError("Database error", true, "GTFSTripsModel", 500, err);
        }
    }

    /** Retrieves specific GTFS trip
     * @param {string} id Id of the trip
     * @param {object} [options] Options object with params
     * @param {boolean} [options.route] Enhance response with route data
     * @param {boolean} [options.shapes] Enhance response with shape data
     * @param {boolean} [options.service] Enhance response with service data
     * @param {boolean} [options.stops] Enhance response with stop data
     * @param {boolean} [options.stopTimes] Enhance response with stop times data
     * @param {string} [options.date] Filter by specific date in the 'YYYY-MM-DD' format
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string, options:
        {
            route?: boolean,
            shapes?: boolean,
            service?: boolean,
            stops?: boolean,
            stopTimes?: boolean,
            date?: string,
        } = {}): Promise<object> => {
        const { stopTimes, stops, shapes } = options;
        return this.sequelizeModel
            .findByPk(id, { include: this.GetInclusions(options) })
            .then((trip) => {
                if (!trip) {
                    return null;
                }
                return this.ConvertItem(trip, { stops, shapes, stopTimes });
            });
    }

    /** Prepare ORM query with selected params
     * @param {object} options Options object with params
     * @param {boolean} [options.route] Enhance response with route data
     * @param {boolean} [options.shapes] Enhance response with shape data
     * @param {boolean} [options.service] Enhance response with service data
     * @param {boolean} [options.stops] Enhance response with stop data
     * @param {boolean} [options.stopTimes] Enhance response with stop times data
     * @param {string} [options.date] Filter by specific date in the 'YYYY-MM-DD' format
     * @returns Array of inclusions
     */
    protected GetInclusions = (options: {
        route?: boolean,
        shapes?: boolean,
        service?: boolean,
        stops?: boolean,
        stopTimes?: boolean,
        date?: string,
    }) => {
        const { stops, stopTimes, shapes, service, route, date } = options;
        const include: any = [];

        // stop_times and stops both selected to include, nest them together
        if (stops && stopTimes) {
            include.push({
                as: "stop_times",
                include: [{
                    as: "stop",
                    model: sequelizeConnection.models[RopidGTFS.stops.pgTableName],
                }],
                model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
            });
            // Only stops or only stop times selected to include
        } else {
            stops && include.push({
                as: "stops",
                model: sequelizeConnection.models[RopidGTFS.stops.pgTableName],
                through: { attributes: [] },
            });

            stopTimes && include.push({
                as: "stop_times",
                model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
            });
        }

        shapes && include.push({
            as: "shapes",
            model: sequelizeConnection.models[RopidGTFS.shapes.pgTableName],
        });

        if (date || service) {
            include.push({
                as: "service",
                model: sequelizeConnection.models[RopidGTFS.calendar.pgTableName]
                    .scope({ method: ["forDate", date] }),
            });
        }

        route && include.push({
            as: "route",
            model: sequelizeConnection.models[RopidGTFS.routes.pgTableName],
        });
        return include;
    }

    /**
     * Convert a single db result to proper output format with all its included sub-elements
     * @param {object} trip Trip object
     * @param {object} options Options object with params
     * @param {boolean} [options.shapes] If shapes were included in filter then convert shapes payload
     * @param {boolean} [options.stops] If stops were included in filter then convert stops payload
     * @returns A converted item of the result
     */
    protected ConvertItem = (trip: any, options: { stops?: boolean, shapes?: boolean, stopTimes?: boolean }) => {
        const { stop_times: stopTimesItems = [],
            stops: stopItems = [],
            shapes: shapeItems = [],
            ...item } = trip.toJSON();
        return {
            ...item,
            ...(options.stops && options.stopTimes &&
                {
                    stop_times: stopTimesItems
                        .map((stopTime: any) => {
                            const convertedStopTime = stopTime;
                            convertedStopTime.stop = this.BuildResponse(stopTime.stop, "stop_lon", "stop_lat");
                            return convertedStopTime;
                        }),
                }),
            ...(options.stops && !options.stopTimes &&
                {
                    stops: stopItems
                        .map((stop: any) => this.BuildResponse(stop, "stop_lon", "stop_lat")),
                }),
            ...(!options.stops && options.stopTimes &&
                {
                    stop_times: stopTimesItems,
                }),
            ...(options.shapes
                && {
                    shapes: shapeItems
                        .map((shape: any) => this.BuildResponse(shape, "shape_pt_lon", "shape_pt_lat")),
                }),
        };
    }

    /**
     * Builds the correct format of a response data
     */
    protected BuildResponse = (responseObject: any, latLoc: string, longLoc: string) => {
        return buildGeojsonFeature(responseObject, "shape_pt_lon", "shape_pt_lat");
    }
}
