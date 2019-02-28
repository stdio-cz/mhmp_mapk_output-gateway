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

    public Associate = (models: any) => {
        this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
            foreignKey: "trip_id",
        });
    }

    public GetAll = async (options: { limit?: number, offset?: number, stopId?: string } = {}): Promise<any> => {
        const {limit, offset, stopId} = options;
        try {
            const include = [];
            if (stopId) {
                include.push({
                    attributes: [],
                    model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
                    where: {
                        stop_id: stopId,
                    },
                });
            }

            const data = await this.sequelizeModel.findAll({
                include,
                limit,
                offset,
                order: [["trip_id", "DESC"]],
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
