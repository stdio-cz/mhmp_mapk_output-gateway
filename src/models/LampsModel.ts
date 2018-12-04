/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

export class LampsModel extends GeoJsonModel {
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
                dim_value: { type: Number },
                groups: [ { type: String } ],
                id: { type: String, required: true },
                lamppost_id: { type: String, required: true },
                last_dim_override: { type: Number },
                state: {
                    description: { type: String },
                    id: { type: Number, required: true },
                },
                timestamp: { type: Number, required: true },
            },
            type: { type: String, required: true },
        });

        // assign existing mongo model or create new one
        try {
            this.model = model("Lamps"); // existing "Lamps" model
        } catch (error) {
            // create $geonear index
            this.schema.index({ geometry: "2dsphere" });
            // uses "lamps" database collection
            // to specify different one, pass it as 3rd parameter
            this.model = model("Lamps", this.schema /*, this.collectionName*/);
        }
    }

}
