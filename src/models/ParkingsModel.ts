/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

export class ParkingsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super("Parkings", {
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

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text", "properties.address": "text" },
            { weights: { "properties.name": 5, "properties.address": 1 } }
        );
    }
}
