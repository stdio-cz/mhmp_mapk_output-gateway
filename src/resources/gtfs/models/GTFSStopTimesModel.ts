import { RopidGTFS } from "data-platform-schema-definitions";
import { sequelizeConnection } from "../../../core/database";
import { CustomError } from "../../../core/errors";
import { SequelizeModel } from "../../../core/models";

export class GTFSStopTimesModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.stop_times.name, RopidGTFS.stop_times.pgTableName,
            RopidGTFS.stop_times.outputSequelizeAttributes);
    }

    public Associate = (models: any) => {
        this.sequelizeModel.belongsTo(models.GTFSTripsModel.sequelizeModel, {
            foreignKey: "trip_id",
        });
    }

    /** Retrieves all gtfs stop times for specific stop id
     * @param {object} options Options object with params
     * @param {string} options.stopId Filter by specific stop id
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {string} [options.from] Filter records since specific time in the 'H:mm:ss' format
     * @param {string} [options.to] Filter records until specific time in the 'H:mm:ss' format
     * @param {string} [options.date] Filter by specific date in the 'YYYY-MM-DD' format
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        stopId: string,
        limit?: number,
        offset?: number,
        from?: string,
        to?: string,
        date?: string,
    }): Promise<any> => {
        const {limit, offset, to, from, date, stopId} = options;
        const include: any = [];
        try {
            const where: any = {
                stop_id: stopId, [sequelizeConnection.Op.and]: [],
            };

            if (from) {
                where[sequelizeConnection.Op.and].push(sequelizeConnection.literal(
                    `to_timestamp('${from}', 'HH24:mm:ss') ` +
                    `<= to_timestamp(regexp_replace(arrival_time, '^24', '00'), 'HH24:MI:SS')`,
                ));
            }

            if (to) {
                where[sequelizeConnection.Op.and].push(sequelizeConnection.literal(
                    `to_timestamp('${to}', 'HH24:mm:ss') ` +
                    `>= to_timestamp(regexp_replace(arrival_time, '^24', '00'), 'HH24:MI:SS')`,
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

    public GetOne = (id: any): Promise<any> => {
        throw new CustomError("Method not implemented", false);
    }

}
