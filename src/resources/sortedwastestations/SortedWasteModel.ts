import { SortedWasteStations } from "golemio-schema-definitions";
import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { CustomError } from "../../core/errors";
import { GeoJsonModel } from "../../core/models";

export class SortedWasteStationsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(  SortedWasteStations.name,
                SortedWasteStations.outputMongooseSchemaObject,
                SortedWasteStations.mongoCollectionName );

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }
}
