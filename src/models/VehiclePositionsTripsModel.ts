import {RopidGTFS, VehiclePositions} from "data-platform-schema-definitions";
import {IncludeOptions, Model} from "sequelize";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {models} from "./index";
import {SequelizeModel} from "./SequelizeModel";

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

        this.sequelizeModel.belongsTo(m.VehiclePositionsPositionsViewModel.sequelizeModel, {
            foreignKey: "id",
            targetKey: "trips_id",
        });

        this.sequelizeModel.belongsTo(m.GTFSTripsModel.sequelizeModel, {
            foreignKey: "gtfs_trip_id",
        });
    }

    public GetAll = async (options: {
        routeId?: string,
        routeShortName?: string,
        tripId?: string,
        includeGTFS?: boolean,
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

            return data.map((item: any) => this.ConvertItem(item));
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string, options: {
        includePositions?: boolean,
        includeGTFS?: boolean,
    } = {}): Promise<object | null> => {
        log.debug("Getting one");
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

    private ConvertItem = (item: any) => {
        const {v_vehiclepositions_last_position, ropidgtfs_trip, all_positions = [], ...trip} = item.toJSON();
        return {
            ...trip,
            position: buildResponse(v_vehiclepositions_last_position, "lng", "lat"),
            ...(all_positions.length &&
                {all_positions: all_positions.map((position: any) => buildResponse(position, "lng", "lat"))}
            ),
            ...(ropidgtfs_trip &&
                {gtfs_trip: models.GTFSTripsModel.ConvertItem(ropidgtfs_trip)}
            ),
        };
    }

    private ComposeIncludes = (options: {
        includePositions?: boolean,
        includeGTFS?: boolean,
    }): Array<Model<any, any> | IncludeOptions> => {
        const include: Array<Model<any, any> | IncludeOptions> = [{
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
        if (options.includeGTFS) {
            include.push({
                include: models.GTFSTripsModel.GetInclusions({shapes: true, route: true, stops: true, stopTimes: true}),
                model: sequelizeConnection.models[RopidGTFS.trips.pgTableName],
            });
        }
        return include;
    }
}
