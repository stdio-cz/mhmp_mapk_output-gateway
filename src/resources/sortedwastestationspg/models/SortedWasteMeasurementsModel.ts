import { CustomError } from "@golemio/errors";
import { SortedWasteStations } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { SequelizeModel } from "./../../../core/models/";

export interface IContainer {
    id: string;
    container_id: string;
    code: string;
    percent_calculated: number;
    upturned: number;
    temperature: number;
    battery_status: number;
    measured_at_utc: string;
    prediction_utc: string;
    firealarm: number;
    updated_at: number;
}

export class SortedWasteMeasurementsModel extends SequelizeModel {

    public constructor() {
        super(SortedWasteStations.sensorsMeasurements.name, SortedWasteStations.sensorsMeasurements.pgTableName,
            SortedWasteStations.sensorsMeasurements.outputSequelizeAttributes);

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
                    measured_at_utc: {
                        [Sequelize.Op.gte]: from,
                    },
                });
            }

            if (to) {
                where[and].push({
                    measured_at_utc: {
                        [Sequelize.Op.lte]: to,
                    },
                });
            }

            const attributes: string[] =  [
                "container_code",
                "container_id",
                "percent_calculated",
                "upturned",
                "temperature",
                "battery_status",
                "measured_at_utc",
                "prediction_utc",
                "firealarm",
                "updated_at",
                "created_at",
            ];

            order.push(["measured_at_utc", "DESC"]);

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
                    percent_calculated: container.percent_calculated,
                    upturned: container.upturned,
                    temperature: container.temperature,
                    battery_status: container.battery_status,
                    measured_at_utc: container.measured_at_utc,
                    prediction_utc: container.prediction_utc,
                    firealarm: container.firealarm,
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
