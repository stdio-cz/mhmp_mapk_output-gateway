import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {models as sequelizeModels} from "./index";

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

    public Associate = (models: any) => {
        this.sequelizeModel.belongsTo(models.GTFSTripsModel.sequelizeModel, {
            foreignKey: "trip_id",
        });
    }

    public GetAll = async (stopId: string, options: {
        limit?: number,
        offset?: number,
        from?: string,
        to?: string,
        date?: string,
    } = {}): Promise<any> => {
        const {limit, offset, to, from, date} = options;
        const include: any = [];
        try {
            const where: any = {
                stop_id: stopId, [sequelizeConnection.Op.and]: [],
            };

            if (from) {
                where[sequelizeConnection.Op.and].push(sequelizeConnection.literal(
                    `to_timestamp('${from}', 'HH24:mm:ss') <= to_timestamp(regexp_replace(arrival_time, '^24', '00'), 'HH24:MI:SS')`,
                ));
            }

            if (to) {
                where[sequelizeConnection.Op.and].push(sequelizeConnection.literal(
                    `to_timestamp('${to}', 'HH24:mm:ss') >= to_timestamp(regexp_replace(arrival_time, '^24', '00'), 'HH24:MI:SS')`,
                ));
            }

            if (date) {
                include.push({
                    attributes: [],
                    include: [{
                        as: "service",
                        attributes: [],
                        model: sequelizeConnection.models[RopidGTFS.calendar.pgTableName]
                            .scope({method: ["forDate", date]}),
                    }],
                    model: sequelizeConnection.models[RopidGTFS.trips.pgTableName],
                    required: true,
                });
            }

            const data = await this.sequelizeModel.findAll({
                include,
                limit,
                offset,
                order: [["stop_id", "ASC"], ["departure_time", "ASC"]],
                where,
            });

            return data;
        } catch
            (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }
}
