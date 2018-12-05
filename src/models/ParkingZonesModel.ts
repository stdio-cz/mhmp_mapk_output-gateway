/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

export class ParkingZonesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super("ParkingZones", {
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

        this.schema.index({ "properties.name": "text"});
    }

    PrimaryIdentifierSelection = (inId: String) => {
        return {"properties.code": inId};
    }

}
