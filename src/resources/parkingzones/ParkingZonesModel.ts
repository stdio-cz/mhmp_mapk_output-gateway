import { CustomError } from "@golemio/errors";
import { ParkingZones } from "@golemio/schema-definitions";
import { log } from "../../core/Logger";
import { GeoJsonModel } from "../../core/models";

export class ParkingZonesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(ParkingZones.name, ParkingZones.outputMongooseSchemaObject, ParkingZones.mongoCollectionName);

        this.schema.index({ "properties.name": "text" });
        this.AddProjection({ "properties.tariffs": 0 });
    }

    /** Retrieves tariffs to one zone
     * @param inId Id of the record which tariffs to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetTariffs = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId),
            { "properties.tariffs": 1, "_id": 0 },
        ).exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by specified selection.", this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, "ParkingZonesModel", 404);
        } else if (!found.properties || found.properties.tariffs === undefined) {
            log.debug("Object doesn't have properties or properties.tariffs");
            throw new CustomError("Id `" + inId + "` not found", true, "ParkingZonesModel", 404);
        } else {
            return found.properties.tariffs;
        }
    }
}
