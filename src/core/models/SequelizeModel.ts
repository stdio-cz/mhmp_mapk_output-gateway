import * as Sequelize from "sequelize";
import { DefineModelAttributes } from "sequelize";
import { DefineOptions } from "sequelize";
import { sequelizeConnection } from "../database";
import { BaseModel } from "./";

/**
 * General model for data stored in PostgreSQL.
 *
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */
export abstract class SequelizeModel extends BaseModel {
    /** Name of the model */
    protected name: string;

    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;

    protected constructor(name: string, tableName: string, attributes: DefineModelAttributes<any>,
                          options?: DefineOptions<any>) {
        super(name);
        this.sequelizeModel = sequelizeConnection.define(tableName, attributes, options);
        // Remove all audit fields from DB tables that are not needed in the output view
        // this.sequelizeModel.removeAttribute("created_by");
        // this.sequelizeModel.removeAttribute("update_batch_id");
        // this.sequelizeModel.removeAttribute("create_batch_id");
        // this.sequelizeModel.removeAttribute("updated_by");
        // this.sequelizeModel.removeAttribute("created_at");
        // this.sequelizeModel.removeAttribute("updated_at");
    }

    /**
     * Associate all database table relations
     */
    public Associate = (models: any): void => {
        return;
    }
}
