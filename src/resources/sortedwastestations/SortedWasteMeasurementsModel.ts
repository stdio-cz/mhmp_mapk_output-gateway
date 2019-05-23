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

    public GetAll = async () => {
        const q = this.model.find();
        q.select(this.projection);
        return await q.exec();
    }

    public GetOne = async () => {
        //
    }
}
