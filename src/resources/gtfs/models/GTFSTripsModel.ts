import { RopidGTFS } from "data-platform-schema-definitions";
import { sequelizeConnection } from "../../../core/database";
import { CustomError } from "../../../core/errors";
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

    public GetAll = async (options:
                               {
                                   limit?: number,
                                   offset?: number,
                                   route?: boolean,
                                   stopId?: string,
                                   shapes?: boolean,
                                   service?: boolean,
                                   stops?: boolean,
                                   stopTimes?: boolean,
                                   date?: string,
                               } = {},
    ): Promise<any> => {
        const {limit, offset, stopId, stops, shapes} = options;
        try {
            let include: any = [];
            if (stopId) {
                include.push({
                    as: "has_stop_id",
                    attributes: [],
                    model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
                    where: {
                        stop_id: stopId,
                    },
                });
            }

            include = include.concat(this.GetInclusions(options));

            const data = await this.sequelizeModel.findAll({
                include,
                limit,
                offset,
                order: [["trip_id", "DESC"]],
            });

            if (stops || shapes) {
                return data.map((trip) => this.ConvertItem(trip, {stops, shapes}));
            }

            return data;
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public ConvertItem = (trip: any, options: { stops?: boolean, shapes?: boolean }) => {
        const {stops: stopItems = [], shapes: shapeItems = [], ...item} = trip.toJSON();
        return {
            ...item,
            ...(options.stops &&
                {
                    stops: stopItems
                        .map((stop: any) => buildGeojsonFeature(stop, "stop_lon", "stop_lat")),
                }),
            ...(options.shapes
                && {
                    shapes: shapeItems
                        // TODO: Call {this}.buildResponse and call buildGeojsonFeature from there
                        // don't call buildGeojsonFeature directly.
                        .map((shape: any) => buildGeojsonFeature(shape, "shape_pt_lon", "shape_pt_lat")),
                }),
        };
    }

    public GetOne = async (id: string, options:
        {
            route?: boolean,
            shapes?: boolean,
            service?: boolean,
            stops?: boolean,
            stopTimes?: boolean,
            date?: string,
        } = {}): Promise<object> => {
        const {stops, shapes} = options;
        return this.sequelizeModel
            .findByPk(id, {include: this.GetInclusions(options)})
            .then((trip) => {
                if (!trip) {
                    return null;
                }

                return this.ConvertItem(trip, {stops, shapes});
            });
    }

    public GetInclusions = (options: {
        route?: boolean,
        shapes?: boolean,
        service?: boolean,
        stops?: boolean,
        stopTimes?: boolean,
        date?: string,
    }) => {
        const {stops, stopTimes, shapes, service, route, date} = options;
        const include: any = [];

        stops && include.push({
            as: "stops",
            model: sequelizeConnection.models[RopidGTFS.stops.pgTableName],
            through: {attributes: []},
        });

        stopTimes && include.push({
            as: "stop_times",
            model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
        });

        shapes && include.push({
            as: "shapes",
            model: sequelizeConnection.models[RopidGTFS.shapes.pgTableName],
        });

        if (date || service) {
            include.push({
                as: "service",
                model: sequelizeConnection.models[RopidGTFS.calendar.pgTableName]
                    .scope({method: ["forDate", date]}),
            });
        }

        route && include.push({
            as: "route",
            model: sequelizeConnection.models[RopidGTFS.routes.pgTableName],
        });
        return include;
    }
}
