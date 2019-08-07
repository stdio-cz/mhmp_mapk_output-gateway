import { CustomError } from "golemio-errors";
import { RopidGTFS } from "golemio-schema-definitions";
import moment = require("moment");
import { models as sequelizeModels } from ".";
import { sequelizeConnection } from "../../../core/database";
import { SequelizeModel } from "../../../core/models";

export class GTFSCalendarModel extends SequelizeModel {

    public weekDayMap: { [key: number]: string; } = {
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
        0: "sunday",
    };

    public constructor() {
        super(RopidGTFS.calendar.name, RopidGTFS.calendar.pgTableName, RopidGTFS.calendar.outputSequelizeAttributes, {
            scopes: {
                forDate(date?: string) {
                    if (!date) {
                        return {};
                    }
                    const day = moment(date).day();
                    const where: any = {
                        [sequelizeConnection.Op.and]: [
                            sequelizeConnection.literal(
                                `DATE('${date}') ` +
                                `BETWEEN to_date(start_date, 'YYYYMMDD') AND to_date(end_date, 'YYYYMMDD')`,
                            ),
                            { [sequelizeModels.GTFSCalendarModel.weekDayMap[day]]: 1 },
                        ],
                    };
                    return { where };
                },
            },
        });
    }

    /** Retrieves all gtfs services
     * @param {object} [options] Options object with params
     * @param {string} [options.date] Filter by specific date in the 'YYYY-MM-DD' format
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        date?: string,
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const { limit, offset, date } = options;
        try {
            const data = await this.sequelizeModel
                .scope({ method: ["forDate", date] })
                .findAll({
                    limit,
                    offset,
                    order: [["service_id", "asc"]],
                });
            return data;
        } catch (err) {
            throw new CustomError("Database error", true, "GFSCalendar", 500, err);
        }
    }

    public GetOne = (id: any): Promise<any> => {
        throw new CustomError("Method not implemented", false);
    }

}
