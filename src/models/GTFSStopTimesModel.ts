import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSStopTimesModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.stop_times.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.stop_times.pgTableName,
            RopidGTFS.stop_times.outputSequelizeAttributes,
        );
    }

    // public GetAll = async (options: { limit?: number, offset?: number } = {}): Promise<any> => {
    //     const {limit, offset} = options;
    //     try {
    //         const data = await this.sequelizeModel.findAll({
    //             limit,
    //             offset,
    //             order: [["trip_id", "DESC"]],
    //         });
    //         return {
    //             features: data,
    //             type: "FeatureCollection",
    //         };
    //     } catch (err) {
    //         throw new CustomError("Database error", true, 500, err);
    //     }
    // }
    //
    // public GetOne = async (id: number): Promise<object> => {
    //     return this.sequelizeModel.findByPk(id);
    // }
}
