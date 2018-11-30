/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

export class ParkingsModel extends GeoJsonModel {
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
                address: { type: String },
                district: { type: String },
                id: { type: Number, required: true },
                name: { type: String, required: true },
                num_of_free_places: { type: Number, required: true },
                num_of_taken_places: { type: Number, required: true },
                parking_type: {
                    description: { type: String, required: true },
                    id: { type: Number, required: true },
                },
                timestamp: { type: Number, required: true },
                total_num_of_places: { type: Number, required: true },
            },
            type: { type: String, required: true },
        });

        // assign existing mongo model or create new one
        try {
            this.model = model("Parkings"); // existing "Parking" model
        } catch (error) {
            // create $geonear index
            this.schema.index({ geometry: "2dsphere" });
            // create $text index
            this.schema.index({ "properties.name": "text", "properties.address": "text" },
                { weights: { "properties.name": 5, "properties.address": 1 } });
            // uses "parkings" database collection (name of the model or plural of the model's name, eg. "parkings" for Parking model)
            // to specify different one, pass it as 3rd parameter
            this.model = model("Parkings", this.schema /*, this.collectionName*/);
        }
    }

}
