import { CustomError } from "@golemio/errors";
import { VehiclePositions } from "@golemio/schema-definitions";
import { IncludeOptions, Model } from "sequelize";
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

        this.sequelizeModel.hasOne(m.VehiclePositionsVehicleTypesModel.sequelizeModel, {
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
    } = {}): Promise<any> => {

        // console.log(await this.sequelizeModel
        //     .findAll({}));

        try {
            const { limit, offset } = options;
            const include = this.ComposeIncludes(options);
            const data = await this.sequelizeModel
                .findAll({
                    include,
                    limit,
                    offset,
                    where: {
                        gtfs_trip_id: { [sequelizeConnection.Sequelize.Op.ne]: null },
                        ...(options.routeId && { gtfs_route_id: options.routeId }),
                        ...(options.routeShortName && { gtfs_route_short_name: options.routeShortName }),
                        ...(options.tripId && { gtfs_trip_id: options.tripId }),
                    },
                });
            return buildGeojsonFeatureCollection(data.map((item: any) => this.ConvertItem(item)));
        } catch (err) {
            throw new CustomError("Database error", true, "VehiclepositionsTripsModel", 500, err);
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
            },
            trip: {
                agency_name: {
                    real: trip.agency_name_real,
                    scheduled: trip.agency_name_scheduled,
                },
                cis: {
                    line_id: trip.cis_line_id,
                    line_number: trip.cis_line_number,
                },
                gtfs: {
                    route_id: trip.gtfs_route_id,
                    route_short_name: trip.gtfs_route_short_name,
                    trip_headsign: trip.gtfs_trip_headsign,
                    trip_id: trip.gtfs_trip_id,
                },
                origin_route_name: trip.origin_route_name,
                sequence_id: trip.sequence_id,
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
     * @param {boolean} [options.includePositions] Should include all vehicle positions
     * @returns Array of inclusions
     */
    private ComposeIncludes = (options: {
        includePositions?: boolean,
    }): Array<Model<any, any> | IncludeOptions> => {
        const include: Array<Model<any, any> | IncludeOptions> = [{
            as: "last_position",
            model: sequelizeConnection.models.v_vehiclepositions_last_position_v2,
            where: {
                tracking: 2,
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
            });
        }
        return include;
    }
}
