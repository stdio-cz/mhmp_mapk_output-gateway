import { Parkings } from "data-platform-schema-definitions";
import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { CustomError } from "../../core/errors";
import { GeoJsonModel } from "../../core/models";

export class ParkingsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(Parkings.name, Parkings.outputMongooseSchemaObject, Parkings.mongoCollectionName);

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text", "properties.address": "text" },
            { weights: { "properties.name": 5, "properties.address": 1 } },
        );
    }
}
