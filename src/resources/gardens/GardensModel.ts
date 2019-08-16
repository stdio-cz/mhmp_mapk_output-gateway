import { Gardens } from "golemio-schema-definitions";
import { GeoJsonModel } from "../../core/models";

export class GardensModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(
            Gardens.name,
            Gardens.outputMongooseSchemaObject,
            Gardens.mongoCollectionName,
        );

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }
}
