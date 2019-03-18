import {VehiclePositions} from "data-platform-schema-definitions";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {SequelizeModel} from "./SequelizeModel";

export class VehiclePositionsModel extends SequelizeModel {

    public constructor() {
        super(VehiclePositions.name, VehiclePositions.trips.pgTableName,
            VehiclePositions.trips.outputSequelizeAttributes);
    }

    public GetAll = async (): Promise<any> => {
        try {
            const data = await this.sequelizeModel
                .findAll({
                    where: {
                        created: {
                            [sequelizeConnection.Op.gt]:
                                sequelizeConnection.literal("(NOW() - INTERVAL '5 min')"),
                        },
                    },
                });

            return {
                features: data.map((item: any) => buildResponse(item, "lng", "lat")),
                type: "FeatureCollection",
            };
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
