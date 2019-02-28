import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSStopModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.stops.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.stops.pgTableName,
            RopidGTFS.stops.outputSequelizeAttributes,
        );
    }

    public Associate = (models: any) => {
        // this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
        //     foreignKey: "trip_id",
        // });
    }

    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        lat?: number,
        lng?: number,
        range?: number,
    } = {}): Promise<any> => {
        const {limit, offset} = options;
        try {
            const data = await this.sequelizeModel.findAll({
                limit,
                offset,
                order: [["stop_id", "DESC"]],
            });
            return {
                features: data,
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string): Promise<object> => {
        return this.sequelizeModel.findByPk(id);
    }
}
