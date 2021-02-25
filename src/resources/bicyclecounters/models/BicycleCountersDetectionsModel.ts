import { BicycleCounters } from "@golemio/schema-definitions";
import { IBicycleCountersModels, IDetection } from ".";

import { CustomError } from "@golemio/errors";
import { SequelizeModel } from "../../../core/models";

import * as Sequelize from "sequelize";

export class BicycleCountersDetectionsModel extends SequelizeModel {

    public constructor() {
        super(BicycleCounters.detections.name, BicycleCounters.detections.pgTableName,
            BicycleCounters.detections.outputSequelizeAttributes);

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
     * @param {string} [options.aggregate] if not null|undefined sum aggregated by directions_id is returned
     * @param {array} [options.id[]] direction_ids (locations_id? // To discuss)
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
            const order: string[][] = [["directions_id", "desc"]];
            const attributes: any[] =  [["directions_id", "id"]];

            let group: string[] | undefined;
            const where: any = {};

            if (aggregate) {
                attributes.push([Sequelize.fn("sum", Sequelize.col("value")), "value"]);
                attributes.push([Sequelize.fn("sum", Sequelize.col("value_pedestrians")), "value_pedestrians"]);
                attributes.push([Sequelize.literal("STRING_AGG(locations_id,', ')"), "locations_id"]);
                attributes.push([Sequelize.fn("count", Sequelize.col("directions_id")), "measurement_count"]);
                group = ["directions_id"];
            } else {
                attributes.push("value");
                attributes.push("value_pedestrians");
                attributes.push("measured_from");
                attributes.push("measured_to");
                attributes.push("locations_id");
                order.push(["locations_id", "desc"]);
                order.push(["measured_from", "desc"]);
            }

            if (id && Array.isArray(id) && id.length > 0) {
                where.directions_id = id;
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
                raw: true, // we should use raw whenever it is possible imho
                where,
            });

            return data;
        } catch (err) {
            throw new CustomError("Database error", true, "BicycleCountersDetectionsModel", 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }
}
