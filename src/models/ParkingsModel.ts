/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
import { Parkings } from "data-platform-schema-definitions";

export class ParkingsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(Parkings.name, Parkings.outputMongooseSchemaObject, Parkings.mongoCollectionName);

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text", "properties.address": "text" },
            { weights: { "properties.name": 5, "properties.address": 1 } }
        );
    }
}
