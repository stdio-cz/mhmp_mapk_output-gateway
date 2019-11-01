import { SortedWasteStations } from "@golemio/schema-definitions";
import * as moment from "moment";
import { MongoModel } from "../../../core/models";

export class SortedWastePicksModel extends MongoModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(SortedWasteStations.sensorsPicks.name,
            SortedWasteStations.sensorsPicks.outputMongooseSchemaObject,
            SortedWasteStations.sensorsPicks.mongoCollectionName);
    }

    public GetAll = async (
        sensorId?: number,
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
        if (sensorId) {
            q.where({ container_id: sensorId });
        }
        if (from) {
            const fromTimestamp = new Date(from).getTime();
            q.where({ pick_at_utc: { $gt: fromTimestamp } });
        }
        if (to) {
            const toTimestamp = new Date(to).getTime();
            q.where({ pick_at_utc: { $lt: toTimestamp } });
        }
        q.select(this.projection);
        const result = await q.exec();
        return result.map((x: any) => {
            const json = x.toJSON();
            return {
                ...json,
                pick_at_utc: json.pick_at_utc != null ? moment(json.pick_at_utc).toISOString() : null,
            };
        });
    }

    public GetOne = async () => {
        //
    }
}
