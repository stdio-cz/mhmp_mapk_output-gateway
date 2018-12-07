/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

export class LampsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super("IGStreetLamps", {
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
    }
}
