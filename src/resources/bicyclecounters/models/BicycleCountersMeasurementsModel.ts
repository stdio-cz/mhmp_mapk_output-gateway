import { BicycleCounters } from "@golemio/schema-definitions";
import * as moment from "moment";
import { MongoModel } from "../../../core/models";

export class BicycleCountersMeasurementsModel extends MongoModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(BicycleCounters.measurements.name,
            BicycleCounters.measurements.outputMongooseSchemaObject,
            BicycleCounters.measurements.mongoCollectionName);
    }

    public GetAll = async (
        counterId?: number,
        limit?: number,
        offset?: number,
        from?: string,
        to?: string,
    ) => {
        const q = this.model.find();
        if (limit) {
            q.limit(limit);
        }
        if (offset) {
            q.skip(offset);
        }
        if (counterId) {
            q.where({ counter_id: { $in: counterId }});
        }
        if (from) {
            const fromTimestamp = new Date(from).getTime();
            q.where({ measured_from: { $gt: fromTimestamp } });
        }
        if (to) {
            const toTimestamp = new Date(to).getTime();
            q.where({ measured_to: { $lt: toTimestamp } });
        }
        q.select(this.projection);
        q.sort({ measured_from: -1 });
        const result = await q.exec();
        return result.map((x: any) => {
            const json = x.toJSON();
            return {
                ...json,
                measured_from: json.measured_from != null ? moment(json.measured_from).toISOString() : null,
                measured_to: json.measured_to != null ? moment(json.measured_to).toISOString() : null,
            };
        });
    }

    public GetOne = async () => {
        //
    }
}
