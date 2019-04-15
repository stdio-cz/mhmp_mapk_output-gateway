import { CityDistricts } from "golemio-schema-definitions";
import { GeoJsonModel } from "../../core/models";

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
