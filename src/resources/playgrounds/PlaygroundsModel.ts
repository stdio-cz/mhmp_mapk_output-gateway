import { Playgrounds } from "golemio-schema-definitions";
import { GeoJsonModel } from "../../core/models";

export class PlaygroundsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(
            Playgrounds.name,
            Playgrounds.outputMongooseSchemaObject,
            Playgrounds.mongoCollectionName,
        );

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }

}
