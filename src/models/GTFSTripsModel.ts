import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSTripsModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.trips.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.trips.pgTableName,
            RopidGTFS.trips.outputSequelizeAttributes,
        );
    }

    public GetAll = async (): Promise<any> => {
        try {
            const data = await this.sequelizeModel.findAll();
            return {
                features: data,
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object> => {
        return this.sequelizeModel.findByPk(id);
    }
}
