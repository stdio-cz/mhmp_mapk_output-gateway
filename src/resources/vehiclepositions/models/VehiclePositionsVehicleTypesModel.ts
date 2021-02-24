import { VehiclePositions } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { IVehiclePositionsModels } from ".";
import { sequelizeConnection } from "../../../core/database";

export class VehiclePositionsVehicleTypesModel {

    /** The Sequelize Model */
    public sequelizeModel: Sequelize.Model<any, any>;

    public constructor() {
        this.sequelizeModel = sequelizeConnection.define(
            VehiclePositions.vehicleTypes.pgTableName,
            VehiclePositions.vehicleTypes.outputSequelizeAttributes,
        );
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
