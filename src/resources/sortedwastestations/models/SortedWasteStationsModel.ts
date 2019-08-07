import { SortedWasteStations } from "golemio-schema-definitions";
import { GeoJsonModel } from "../../../core/models";

export class SortedWasteStationsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(SortedWasteStations.name,
            SortedWasteStations.outputMongooseSchemaObject,
            SortedWasteStations.mongoCollectionName);
    }
}
