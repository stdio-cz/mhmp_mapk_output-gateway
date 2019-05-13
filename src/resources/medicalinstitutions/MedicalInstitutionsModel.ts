import { MedicalInstitutions } from "golemio-schema-definitions";
import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { CustomError } from "../../core/errors";
import { GeoJsonModel } from "../../core/models";

export class MedicalInstitutionsModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(  MedicalInstitutions.name,
                MedicalInstitutions.outputMongooseSchemaObject,
                MedicalInstitutions.mongoCollectionName );

        // Set model-specific indexes
        this.schema.index(
            { "properties.name": "text" },
        );
    }
}
