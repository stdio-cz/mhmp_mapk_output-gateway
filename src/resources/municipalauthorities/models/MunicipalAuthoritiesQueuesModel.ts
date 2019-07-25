import { MunicipalAuthorities } from "golemio-schema-definitions";
import { Document, Model, model, Schema, SchemaDefinition } from "mongoose";
import { CustomError } from "../../../core/errors";
import { log } from "../../../core/Logger";
import { GeoJsonModel } from "../../../core/models";

export class MunicipalAuthoritiesQueuesModel extends GeoJsonModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(  MunicipalAuthorities.waitingQueues.name,
                MunicipalAuthorities.waitingQueues.outputMongooseSchemaObject,
                MunicipalAuthorities.waitingQueues.mongoCollectionName );
    }

    public GetQueues = async (municipalAuthorityId: string) => {
        return this.model.findOne( { municipal_authority_id: municipalAuthorityId } );
    }

}
