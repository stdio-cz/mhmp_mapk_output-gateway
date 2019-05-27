import { SortedWasteStations } from "golemio-schema-definitions";
import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { CustomError } from "../../core/errors";
import { MongoModel } from "../../core/models";

export class SortedWasteMeasurementsModel extends MongoModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(  SortedWasteStations.sensorsMeasurements.name,
                SortedWasteStations.sensorsMeasurements.outputMongooseSchemaObject,
                SortedWasteStations.sensorsMeasurements.mongoCollectionName );
    }

    public GetAll = async ( sensorId?: number,
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
            q.where({container_id: sensorId});
        }
        if (from) {
            q.where({measured_at_utc: {$gt: from}});
        }
        if (to) {
            q.where({measured_at_utc: {$lt: to}});
        }
        q.select(this.projection);
        return await q.exec();
    }

    public GetOne = async () => {
        //
    }
}
