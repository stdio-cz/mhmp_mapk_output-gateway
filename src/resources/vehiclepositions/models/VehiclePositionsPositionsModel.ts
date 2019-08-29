import { VehiclePositions } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { IVehiclePositionsModels } from ".";
import { sequelizeConnection } from "../../../core/database";

export class VehiclePositionsPositionsModel {

    /** The Sequelize Model */
    public sequelizeModel: Sequelize.Model<any, any>;

    public constructor() {
        this.sequelizeModel = sequelizeConnection.define(
            VehiclePositions.positions.pgTableName,
            VehiclePositions.positions.outputSequelizeAttributes,
        );
        // Remove audit fields attributes directly from model, because they're not at all present in the view in db,
        // but are present in the passed Schema (sql attributes) - because the same as for full table is used
        this.sequelizeModel.removeAttribute("created_by");
        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
        this.sequelizeModel.removeAttribute("updated_by");
        this.sequelizeModel.removeAttribute("created_at");
        this.sequelizeModel.removeAttribute("updated_at");
    }

    public Associate = (m: IVehiclePositionsModels) => {
        this.sequelizeModel.belongsTo(m.VehiclePositionsTripsModel.sequelizeModel, {
            as: "all_positions",
            foreignKey: "trips_id",
        });
    }

    public GetAll = async (): Promise<any> => {
        return null;
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
