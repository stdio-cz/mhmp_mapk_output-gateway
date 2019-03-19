import {VehiclePositions} from "data-platform-schema-definitions";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {SequelizeModel} from "./SequelizeModel";

export class VehiclePositionsTripsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.trips.name, VehiclePositions.trips.pgTableName,
            VehiclePositions.trips.outputSequelizeAttributes);
    }

    public Associate = (models: any) => {
        this.sequelizeModel.hasMany(models.VehiclePositionsPositionsModel.sequelizeModel, {
            foreignKey: "trips_id",
        });
        this.sequelizeModel.belongsTo(models.VehiclePositionsPositionsModel.sequelizeModel, {
            as: "position",
            foreignKey: "id",
            targetKey: "trips_id",
        });
        this.sequelizeModel.belongsTo(models.VehiclePositionsPositionsModel.sequelizeModel, {
            as: "actual",
            foreignKey: "id",
            targetKey: "trips_id",
        });
    }

    public GetAll = async (): Promise<any> => {
        try {
            const data = await sequelizeConnection.models[VehiclePositions.positions.pgTableName]
                .findAll({
                    attributes: [
                        [
                            sequelizeConnection
                                .Sequelize
                                .fn("MAX", sequelizeConnection.Sequelize.col("vehiclepositions_positions.created")),
                            "created",
                        ],
                        "trips_id",
                    ],
                    group: ["vehiclepositions_positions.trips_id"],
                    include: [
                        {
                            model: sequelizeConnection.models[VehiclePositions.positions.pgTableName],
                            where: {
                                [sequelizeConnection.Op.and]: [{
                                    created: sequelizeConnection
                                        .Sequelize
                                        .where(
                                            sequelizeConnection.Sequelize.col("vehiclepositions_positions.created"),
                                            "=",
                                            sequelizeConnection.Sequelize.col("vehiclepositions_position.created")),
                                }, {
                                    created: {
                                        [sequelizeConnection.Op.gt]:
                                            sequelizeConnection.literal("(NOW() - INTERVAL '5 min')"),
                                    },
                                }],
                                tracking: 2,
                            },
                        },
                        {
                            model: this.sequelizeModel,
                            where: {
                                gtfs_trip_id: {[sequelizeConnection.Sequelize.Op.ne]: null},
                            },
                        },
                    ],
                    subQuery: true,
                });

            return data.map((item: any) =>
                ({
                    ...item.vehiclepositions_trip.toJSON(),
                    position: buildResponse(item.vehiclepositions_position, "lng", "lat"),
                }),
            );
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        log.debug("Getting one");
        const data = await this.sequelizeModel.findByPk(id);
        if (data) {
            return buildResponse(data, "lng", "lat");
        }
        return null;
    }
}
