/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { GeoJsonModel } from "./GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import { ParkingZones } from "data-platform-schema-definitions";

export class ParkingZonesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(ParkingZones.name, ParkingZones.outputMongooseSchemaObject, ParkingZones.mongoCollectionName);

        this.schema.index({"properties.name": "text"});
        this.AddProjection({"properties.tariffs": 0});
    }

    PrimaryIdentifierSelection = (inId: String) => {
        return {"properties.code": inId};
    }

    /** Retrieves tariffs to one zone
     * @param inId Id of the record which tariffs to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetTariffs = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId), {"properties.tariffs": 1, "_id": 0}).exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by following selection:");
            log.debug(this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else if (!found.properties || found.properties.tariffs === undefined){
            log.debug("Object doesn't have properties or properties.tariffs");
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else {
            return found.properties.tariffs;
        }
    }

}
