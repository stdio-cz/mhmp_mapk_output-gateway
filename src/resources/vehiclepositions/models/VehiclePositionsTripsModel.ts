import {VehiclePositions} from "golemio-schema-definitions";
import {IncludeOptions, Model} from "sequelize";
import {models} from ".";
import {sequelizeConnection} from "../../../core/database";
import {CustomError} from "../../../core/errors";
import {buildGeojsonFeature, buildGeojsonFeatureCollection} from "../../../core/Geo";
import {log} from "../../../core/Logger";
import {SequelizeModel} from "./../../../core/models/";

export class VehiclePositionsTripsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.trips.name, VehiclePositions.trips.pgTableName,
            VehiclePositions.trips.outputSequelizeAttributes);
    }

    public Associate = (m: any) => {
        this.sequelizeModel.hasMany(m.VehiclePositionsPositionsModel.sequelizeModel, {
            as: "all_positions",
            foreignKey: "trips_id",
        });

        this.sequelizeModel.hasOne(m.VehiclePositionsLastPositionModel.sequelizeModel, {
            as: "last_position",
            foreignKey: "trips_id",
        });
    }

    /** Retrieves all vehicle trips
     * @param {object} options Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {string} [options.routeId] Filter trips by specific route id
     * @param {string} [options.routeShortName] Filter trips by specific route short name
     * @param {string} [options.tripId] Filter trips by specific trip id
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        routeId?: string,
        routeShortName?: string,
        tripId?: string,
        includePositions?: boolean,
        limit?: number,
        offset?: number,
    }): Promise<any> => {
        try {
            const {limit, offset} = options;
            const include = this.ComposeIncludes(options);
            const data = await this.sequelizeModel
                .findAll({
                    include,
                    limit,
                    offset,
                    where: {
                        gtfs_trip_id: {[sequelizeConnection.Sequelize.Op.ne]: null},
                        ...(options.routeId && {gtfs_route_id: options.routeId}),
                        ...(options.routeShortName && {gtfs_route_short_name: options.routeShortName}),
                        ...(options.tripId && {gtfs_trip_id: options.tripId}),
                    },
                });

            return buildGeojsonFeatureCollection(data.map((item: any) => this.ConvertItem(item)));
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    /** Retrieves specific vehicle trip
     * @param {string} id Id of the trip
     * @param {object} [options] Options object with params
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string, options: {
        includePositions?: boolean,
    } = {}): Promise<object | null> => {
        try {
            const include = this.ComposeIncludes(options);
            const data = await this.sequelizeModel
                .findOne({
                    include,
                    where: {
                        gtfs_trip_id: id,
                    },
                });

            if (!data) {
                return null;
            }
            return this.ConvertItem(data);
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    /**
     * Convert db result to proper output format
     * @param {object} item Trip object
     * @return
     */
    private ConvertItem = (item: any) => {
        const { last_position,
                ropidgtfs_trip,
                all_positions = [],
                ...trip } = item.toJSON ? item.toJSON() : item;
        const tripObject = {
            trip,
            ...{last_position},
            ...(all_positions.length &&
                {
                    all_positions: buildGeojsonFeatureCollection(
                            all_positions,
                            "lng",
                            "lat",
                    ),
                }
            ),
        };

        return buildGeojsonFeature(tripObject, "last_position.lng", "last_position.lat");
    }

    /** Prepare orm query with selected params
     * @param {object} options Options object with params
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Array of inclusions
     */
    private ComposeIncludes = (options: {
        includePositions?: boolean,
    }): Array<Model<any, any> | IncludeOptions> => {
        const include: Array<Model<any, any> | IncludeOptions> = [{
            as: "last_position",
            model: sequelizeConnection.models.v_vehiclepositions_last_position,
            where: {
                tracking: 2,
            },
        }];
        if (options.includePositions) {
            include.push({
                as: "all_positions",
                model: sequelizeConnection.models[VehiclePositions.positions.pgTableName],
            });
        }
        return include;
    }
}
