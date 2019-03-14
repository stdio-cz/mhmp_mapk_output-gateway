/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import {CityDistricts} from "data-platform-schema-definitions";
import {GeoJsonModel} from "./GeoJsonModel";

export class CityDistrictsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(CityDistricts.name, CityDistricts.outputMongooseSchemaObject, CityDistricts.mongoCollectionName);

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text"},
        );
    }

    protected PrimaryIdentifierSelection = (inId: string) => {
        return {"properties.slug": inId};
    }
}
