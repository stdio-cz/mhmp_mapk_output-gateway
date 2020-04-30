import { BicycleCounters } from "@golemio/schema-definitions";
import { IBicycleCountersModels, IDetection } from ".";
import { SequelizeModel } from "./../../../core/models/";

import * as Sequelize from "sequelize";

import { CustomError } from "@golemio/errors";

export class BicycleCountersTemperaturesModel extends SequelizeModel {

    public constructor() {
        super(BicycleCounters.temperatures.name, BicycleCounters.temperatures.pgTableName,
            BicycleCounters.temperatures.outputSequelizeAttributes);

        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
        this.sequelizeModel.removeAttribute("updated_by");
        this.sequelizeModel.removeAttribute("updated_at");
        this.sequelizeModel.removeAttribute("created_by");
        this.sequelizeModel.removeAttribute("created_at");
    }

    public Associate = (model: IBicycleCountersModels) => {
        return null;
    }

    /**
     * @param {object} [options] Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {string} [options.from] ISO8601 string datetime
     * @param {string} [options.to] ISO8601 string datetime
     * @param {string} [options.aggregate] if not null|undefined avg aggregated by locations_id is returned
     * @param {array} [options.id[]] locations_ids
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        isoDateTo?: any,
        isoDateFrom?: any,
        id?: string[],
        aggregate?: string,
    } = {}): Promise<IDetection[]> => {
        const { limit, offset, isoDateFrom, isoDateTo, id, aggregate } = options;
        try {
            const order: string[][] = [["locations_id", "desc"]];
            const attributes: any[] =  [["locations_id", "id"]];
            let group: string[] | undefined;
            const where: any = {};

            if (aggregate) {
                attributes.push([Sequelize.fn("avg", Sequelize.col("value")), "value"]);
                attributes.push([Sequelize.fn("count", Sequelize.col("locations_id")), "measurement_count"]);
                group = ["locations_id"];
            } else {
                attributes.push("value");
                attributes.push("measured_from");
                attributes.push("measured_to");
            }

            if (id && Array.isArray(id) && id.length > 0) {
                where.locations_id = id;
            }

            if (isoDateFrom) {
                where.measured_from = {
                    [Sequelize.Op.gte] : isoDateFrom.getTime(),
                };
            }

            if (isoDateTo) {
                where.measured_to = {
                    [Sequelize.Op.lte]: isoDateTo.getTime(),
                };
            }

            const data: any = await this.sequelizeModel.findAll({
                attributes,
                group,
                limit,
                offset,
                order,
                raw: true,
                where,
            });

            return data;
        } catch (err) {
            throw new CustomError("Database error", true, "BicycleCountersTemperaturesModel", 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
