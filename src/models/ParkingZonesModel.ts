/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeojsonModel } from "./GeoJsonModel";
const log = require("debug")("data-platform:output-gateway");

export class ParkingZonesModel extends GeojsonModel {
    /** The Mongoose Model */
    public model: Model<any>;
    /** The schema which contains schemaObject for creating the Mongoose Schema */
    protected schema: Schema;
    /** Name of the mongo collection where the model is stored in the database */
    protected collectionName: string|undefined;

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super();
        this.schema = new Schema({
            geometry: {
                coordinates: { type: Array, required: true },
                type: { type: String, required: true },
            },
            properties: {
                code: { type: String, required: true },
                midpoint: { type: Array, required: true },
                name: { type: String, required: true },
                northeast: { type: Array, required: true },
                number_of_places: { type: Number, required: true },
                payment_link: { type: String },
                southwest: { type: Array, required: true },
                tariffs: [{
                    day: {
                        description: { type: String },
                        id: { type: Number },
                    },
                    hours: [{
                        divisibility: { type: Number },
                        from: { type: String },
                        max_parking_time: { type: Number },
                        price_per_hour: { type: Number },
                        to: { type: String },
                    }],
                }],
                timestamp: { type: Number, required: true },
                type: {
                    description: { type: String, required: true },
                    id: { type: Number, required: true },
                },
                zps_id: { type: Number, required: true },
            },
            type: { type: String, required: true },
        });

        // assign existing mongo model or create new one
        try {
            this.model = model("ParkingZones"); // existing "Parking" model
        } catch (error) {
            // create $geonear index
            this.schema.index({ geometry: "2dsphere" });
            // create $text index
            this.schema.index({ "properties.name": "text"});
            // uses "parkingzones" database collection
            // to specify different one, pass it as 3rd parameter
            this.model = model("ParkingZones", this.schema /*, this.collectionName*/);
        }
    }

    /** Retrieves one record from database
     * @param inId Id of the record to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (inId: number): Promise<object> => {
        return await this.model.findOne({ "properties.code": inId }).exec();
    }

}
