import { MunicipalAuthorities } from "@golemio/schema-definitions";
import { GeoJsonModel } from "../../../core/models";

export class MunicipalAuthoritiesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(MunicipalAuthorities.name,
            MunicipalAuthorities.outputMongooseSchemaObject,
            MunicipalAuthorities.mongoCollectionName);

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }
}
