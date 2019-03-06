import {RopidGTFS} from "data-platform-schema-definitions";
import moment = require("moment");
import * as Sequelize from "sequelize";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {models as sequelizeModels} from "./index";

/**
 * TODO
 */
export class GTFSCalendarModel {

    public weekDayMap = {
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
        7: "sunday",
    };
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.calendar.name;
        this.sequelizeModel = sequelizeConnection.define(
            RopidGTFS.calendar.pgTableName,
            RopidGTFS.calendar.outputSequelizeAttributes,
            {
                scopes: {
                    forDate(date?: string) {
                        if (!date) {
                            return {};
                        }
                        const day = moment(date).day();
                        const where: any = {
                            [sequelizeConnection.Op.and]: [
                                sequelizeConnection.literal(
                                    `DATE('${date}') BETWEEN to_date(start_date, 'YYYYMMDD') AND to_date(end_date, 'YYYYMMDD')`,
                                ),
                                {[sequelizeModels.GTFSCalendarModel.weekDayMap[day]]: 1},
                            ],
                        };
                        return {where};
                    },
                },
            },
        );
    }

    public GetAll = async (options: {
        date?: string,
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const {limit, offset, date} = options;
        try {
            const data = await this.sequelizeModel
                .scope({method: ["forDate", date]})
                .findAll({
                    limit,
                    offset,
                    order: [["service_id", "asc"]],
                });
            return data;
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }
}
