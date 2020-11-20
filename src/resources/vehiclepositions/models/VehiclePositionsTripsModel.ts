import { CustomError } from "@golemio/errors";
import { VehiclePositions } from "@golemio/schema-definitions";
import { col, fn, IncludeOptions, Model, Op, where } from "sequelize";
import { IVehiclePositionsModels } from ".";
import { sequelizeConnection } from "../../../core/database";
import { buildGeojsonFeatureCollection, buildGeojsonFeatureLatLng, IGeoJSONFeature } from "../../../core/Geo";
import { SequelizeModel } from "./../../../core/models/";

export class VehiclePositionsTripsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.trips.name, VehiclePositions.trips.pgTableName,
            VehiclePositions.trips.outputSequelizeAttributes);
    }

    public Associate = (m: IVehiclePositionsModels) => {
        this.sequelizeModel.hasMany(m.VehiclePositionsPositionsModel.sequelizeModel, {
            as: "all_positions",
            foreignKey: "trips_id",
        });

        this.sequelizeModel.hasOne(m.VehiclePositionsLastPositionModel.sequelizeModel, {
            as: "last_position",
            foreignKey: "trips_id",
        });

        this.sequelizeModel.belongsTo(m.VehiclePositionsVehicleTypesModel.sequelizeModel, {
            as: "vehicle_type",
            foreignKey: "vehicle_type_id",
        });
    }

    /** Retrieves all vehicle trips
     * @param {object} options Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {string} [options.routeId] Filter trips by specific route id
     * @param {string} [options.routeShortName] Filter trips by specific route short name
     * @param {string} [options.tripId] Filter trips by specific trip id
     * @param {boolean} [options.includeNotTracking] Should include not tracking vehicle positions (those off a trip)
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        cisTripNumber?: number,
        routeId?: string,
        routeShortName?: string,
        tripId?: string,
        includeNotTracking?: boolean,
        includePositions?: boolean,
        limit?: number,
        offset?: number,
        updatedSince?: Date | null,
    } = {}): Promise<any> => {

        // console.log(await this.sequelizeModel
        //     .findAll({}));

        try {
            const { limit, offset } = options;
            const include = this.ComposeIncludes(options);
            const {rows, count} = await this.sequelizeModel
                .findAndCountAll({
                    include,
                    limit,
                    offset,
                    where: {
                        gtfs_trip_id: { [sequelizeConnection.Sequelize.Op.ne]: null },
                        ...(options.cisTripNumber && { cis_trip_number: options.cisTripNumber }),
                        ...(options.routeId && { gtfs_route_id: options.routeId }),
                        ...(options.routeShortName && { gtfs_route_short_name: options.routeShortName }),
                        ...(options.tripId && { gtfs_trip_id: options.tripId }),
                    },
                });

            if (count === 0) {
                return {
                    data: buildGeojsonFeatureCollection([]),
                    metadata: {
                        max_updated_at: options.updatedSince,
                    },
                };
            }
            return {
                data: buildGeojsonFeatureCollection(rows.map((item: any) => this.ConvertItem(item))),
                metadata: {
                    max_updated_at: new Date(Math.max(...rows.map((d) => d.last_position.updated_at))),
                },
            };
        } catch (err) {
            throw new CustomError("Database error", true, "VehiclepositionsTripsModel", 500, err);
        }
    }

    /** Retrieves specific vehicle trip
     * @param {string} id Id of the trip
     * @param {object} [options] Options object with params
     * @param {string} [options.includeNotTracking] Returns last known trip even if it is not tracked at time
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string, options: {
        includeNotTracking?: boolean,
        includePositions?: boolean,
    } = {}): Promise<object | null> => {
        try {
            const include = this.ComposeIncludes(options);
            const data = await this.sequelizeModel
                .findOne({
                    include,
                    order: [
                        [ "start_timestamp", "DESC" ],
                    ],
                    where: {
                        gtfs_trip_id: id,
                    },
                });

            if (!data) {
                return null;
            }
            return this.ConvertItem(data);
        } catch (err) {
            throw new CustomError("Database error", true, "VehiclePositionsTripsModel", 500, err);
        }
    }

    /**
     * Convert db result to proper output format
     * @param {object} item Trip object
     * @return
     */
    private ConvertItem = (item: any): IGeoJSONFeature => {
        const { last_position,
            vehicle_type,
            ropidgtfs_trip,
            all_positions = [],
            ...trip } = item.toJSON ? item.toJSON() : item;

        const tripObject = {
            last_position: {
                bearing: last_position.bearing,
                delay: {
                    actual: last_position.delay,
                    last_stop_arrival: last_position.delay_stop_arrival,
                    last_stop_departure: last_position.delay_stop_departure,
                },
                is_canceled: last_position.is_canceled,
                last_stop: {
                    arrival_time: last_position.last_stop_arrival_time,
                    departure_time: last_position.last_stop_departure_time,
                    id: last_position.last_stop_id,
                    sequence: last_position.last_stop_sequence,
                },
                next_stop: {
                    arrival_time: last_position.next_stop_arrival_time,
                    departure_time: last_position.next_stop_departure_time,
                    id: last_position.next_stop_id,
                    sequence: last_position.next_stop_sequence,
                },
                origin_timestamp: last_position.origin_timestamp,
                shape_dist_traveled: last_position.shape_dist_traveled,
                speed: last_position.speed,
                tracking: (last_position.tracking === 2) ? true : false,
            },
            trip: {
                agency_name: {
                    real: trip.agency_name_real,
                    scheduled: trip.agency_name_scheduled,
                },
                cis: {
                    line_id: trip.cis_line_id,
                    trip_number: trip.cis_trip_number,
                },
                gtfs: {
                    route_id: trip.gtfs_route_id,
                    route_short_name: trip.gtfs_route_short_name,
                    trip_headsign: trip.gtfs_trip_headsign,
                    trip_id: trip.gtfs_trip_id,
                },
                origin_route_name: trip.origin_route_name,
                sequence_id: trip.sequence_id,
                start_timestamp: trip.start_timestamp,
                updated_at: trip.updated_at,
                vehicle_registration_number: trip.vehicle_registration_number,
                vehicle_type,
                wheelchair_accessible: trip.wheelchair_accessible,
            },
            ...(all_positions.length &&
                {
                    all_positions: buildGeojsonFeatureCollection(
                        all_positions.map( (position: any) => {
                            return {
                                bearing: position.bearing,
                                delay: {
                                    actual: position.delay,
                                    last_stop_arrival: position.delay_stop_arrival,
                                    last_stop_departure: position.delay_stop_departure,
                                },
                                is_canceled: position.is_canceled,
                                last_stop: {
                                    arrival_time: position.last_stop_arrival_time,
                                    departure_time: position.last_stop_departure_time,
                                    id: position.last_stop_id,
                                    sequence: position.last_stop_sequence,
                                },
                                lat: position.lat,
                                lng: position.lng,
                                next_stop: {
                                    arrival_time: position.next_stop_arrival_time,
                                    departure_time: position.next_stop_departure_time,
                                    id: position.next_stop_id,
                                    sequence: position.next_stop_sequence,
                                },
                                origin_timestamp: position.origin_timestamp,
                                shape_dist_traveled: position.shape_dist_traveled,
                                speed: position.speed,
                            };
                        }),
                        "lng",
                        "lat",
                        true,
                    ),
                }
            ),
        };

        return buildGeojsonFeatureLatLng(tripObject, last_position.lng, last_position.lat);
    }

    /** Prepare orm query with selected params
     * @param {object} options Options object with params
     * @param {boolean} [options.includeNotTracking] Should include all vehicles, even not tracked
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @param {boolean} [options.updatedSince] Should include all newer positions than updatedSince
     * @returns Array of inclusions
     */
    private ComposeIncludes = (options: {
        includeNotTracking?: boolean,
        includePositions?: boolean,
        updatedSince?: Date | null,
    }): Array<Model<any, any> | IncludeOptions> => {
        const include: Array<Model<any, any> | IncludeOptions> = [{
            as: "last_position",
            model: sequelizeConnection.models.v_vehiclepositions_last_position,
            where: {
                ...(options.includeNotTracking ?
                    { tracking: { [Op.gte]: 0 } } :
                    { tracking: 2 }
                ),
                ...(options.updatedSince && [where(
                    fn("date_trunc", "millisecond", col("last_position.updated_at")),
                    {
                        [Op.gt]: options.updatedSince.toISOString(),
                    },
                )]),
            },
        },
        {
            as: "vehicle_type",
            model: sequelizeConnection.models[VehiclePositions.vehicleTypes.pgTableName],
        }];
        if (options.includePositions) {
            include.push({
                as: "all_positions",
                model: sequelizeConnection.models[VehiclePositions.positions.pgTableName],
                where: {
                    tracking: { [Op.gte]: 0 },
                },
            });
        }
        return include;
    }
}
