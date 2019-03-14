import * as Sequelize from "sequelize";
import {DefineModelAttributes} from "sequelize";
import {DefineOptions} from "sequelize";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {BaseModel} from "./BaseModel";

export abstract class SequelizeModel extends BaseModel {
    /** Name of the model */
    protected name: string;

    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;

    protected constructor(name: string, tableName: string, attributes: DefineModelAttributes<any>,
                          options?: DefineOptions<any>) {
        super(name);
        this.sequelizeModel = sequelizeConnection.define(tableName, attributes, options);
    }

    public Associate = (models: any): void => {
        return;
    }
}
