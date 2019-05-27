import { VehiclePositions } from "golemio-schema-definitions";
import * as Sequelize from "sequelize";
import { sequelizeConnection } from "../../../core/database";
import { log } from "../../../core/Logger";
import { SequelizeModel } from "./../../../core/models/";

export class VehiclePositionsLastPositionModel {

    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;

    public constructor() {
        this.sequelizeModel = sequelizeConnection.define(
            VehiclePositions.lastPositions.pgTableName,
            VehiclePositions.lastPositions.outputSequelizeAttributes,
        );
        // Remove audit fields attributes directly from model, because they're not at all present in the view in db,
        // but are present in the passed Schema (sql attributes) - because the same as for full table is used
        this.sequelizeModel.removeAttribute("id");
        this.sequelizeModel.removeAttribute("created_by");
        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
        this.sequelizeModel.removeAttribute("updated_by");
        this.sequelizeModel.removeAttribute("created_at");
        this.sequelizeModel.removeAttribute("updated_at");
    }

    public Associate = (m: any) => {
        this.sequelizeModel.belongsTo(m.VehiclePositionsTripsModel.sequelizeModel, {
            as: "last_position",
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
