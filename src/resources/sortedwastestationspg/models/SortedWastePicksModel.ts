import { CustomError } from "@golemio/errors";
import { SortedWasteStations } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { SequelizeModel } from "./../../../core/models/";

export class SortedWastePicksModel extends SequelizeModel {

    public constructor() {
        super(SortedWasteStations.sensorsPicks.name, SortedWasteStations.sensorsPicks.pgTableName,
            SortedWasteStations.sensorsPicks.outputSequelizeAttributes);

        this.sequelizeModel.removeAttribute("vendor_id");
        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
    }

    /**
     * @param {object} [options] Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {string} [options.from] ISO date<br>
     * @param {string} [options.to] ISO date<br>
     * @param {string} [options.containerId] container ID<br>
     *     Only data within this range will be returned.
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        containerId?: string,
        from?: string,
        to?: string,
    } = {}): Promise<any> => {
        const { limit, offset, from, to, containerId } = options;
        try {
            const and: symbol = Sequelize.Op.and;
            const order: any[] = [];
            const where: any = {
                [and]: [],
            };

            if (!containerId) {
                return [];
            }

            where[and].push({ container_id: containerId});

            if (from) {
                where[and].push({
                    pick_at_utc: {
                        [Sequelize.Op.gte]: from,
                    },
                });
            }

            if (to) {
                where[and].push({
                    pick_at_utc: {
                        [Sequelize.Op.lte]: to,
                    },
                });
            }

            const attributes: string[] =  [
                "container_code",
                "container_id",
                "pick_minfilllevel",
                "decrease",
                "pick_at_utc",
                "percent_before",
                "percent_now",
                "event_driven",
                "updated_at",
                "created_at",
            ];

            order.push(["pick_at_utc", "DESC"]);

            const data = await this.sequelizeModel.findAll({
                attributes,
                limit,
                offset,
                order,
                raw: true,
                where,
            });

            return data.map((container: any) => {
                return {
                    id: container.container_id,
                    // tslint:disable-next-line: object-literal-sort-keys
                    container_id: container.container_id,
                    code: container.container_code,
                    pick_minfilllevel: +container.pick_minfilllevel  || null,
                    decrease: +container.decrease || null,
                    pick_at_utc: container.pick_at_utc,
                    percent_now: +container.percent_now || null,
                    percent_before: +container.percent_before || null,
                    event_driven: container.event_driven,
                    updated_at: container.updated_at ?
                        new Date(container.updated_at).getTime() : container.created_at ?
                            new Date(container.created_at).getTime() : 0,
                };
            });
        } catch (err) {
            throw new CustomError("Database error", true, "SortedWasteMeasurementsModel", 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
