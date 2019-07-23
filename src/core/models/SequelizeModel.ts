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
    /** The Sequelize Model */
    public sequelizeModel: Sequelize.Model<any, any>;

    /** Name of the model */
    protected name: string;

    protected constructor(
        name: string,
        tableName: string,
        attributes: DefineModelAttributes<any>,
        options?: DefineOptions<any>,
    ) {
        super(name);
        this.sequelizeModel = sequelizeConnection.define(tableName, attributes,
            {
                // Remove all audit fields in the default scope: they will be automatically excluded,
                // as they're not needed in the output view, but are present in the table/data
                defaultScope: {
                    attributes: {
                        exclude: ["created_by",
                            "updated_by",
                            "created_at",
                            "updated_at",
                            "create_batch_id",
                            "update_batch_id"],
                    },
                },
                ...options,
            });
    }

    /**
     * Associate all database table relations
     */
    public Associate = (models: any): void => {
        return;
    }
}
