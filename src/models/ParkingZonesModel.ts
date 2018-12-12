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

        this.schema.index({"properties.name": "text"});
        this.AddProjection({"properties.tariffs": 0});
    }

    PrimaryIdentifierSelection = (inId: String) => {
        return {"properties.code": inId};
    }

    /** Retrieves tariffs to one zone
     * @param inId Id of the record which tariffs to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetTariffs = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId), {"properties.tariffs": 1, "_id": 0}).exec();
        if (!found || found instanceof Array && found.length === 0) {
            log ("Could not find any record by following selection:");
            log (this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else if (!found.properties || found.properties.tariffs === undefined){
            log ("Object doesn't have properties or properties.tariffs");
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else {
            return found.properties.tariffs;
        }
    }

}
