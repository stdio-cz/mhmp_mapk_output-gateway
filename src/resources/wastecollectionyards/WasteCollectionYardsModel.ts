import { WasteCollectionYards } from "@golemio/schema-definitions";
import { GeoJsonModel } from "../../core/models";

export class WasteCollectionYardsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(
            WasteCollectionYards.name,
            WasteCollectionYards.outputMongooseSchemaObject,
            WasteCollectionYards.mongoCollectionName,
        );

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }

}
