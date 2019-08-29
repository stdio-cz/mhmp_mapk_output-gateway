import { SharedBikes } from "@golemio/schema-definitions";
import { GeoJsonModel } from "../../core/models";

export class SharedBikesModel extends GeoJsonModel {
    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(
            SharedBikes.name,
            SharedBikes.outputMongooseSchemaObject,
            SharedBikes.mongoCollectionName,
        );

        // Set model-specific indexes
        this.schema.index({ "properties.name": "text" });
    }
}
