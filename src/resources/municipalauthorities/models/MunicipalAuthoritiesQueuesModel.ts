import { MunicipalAuthorities } from "@golemio/schema-definitions";
import { MongoModel } from "../../../core/models";

export class MunicipalAuthoritiesQueuesModel extends MongoModel {

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        super(MunicipalAuthorities.waitingQueues.name,
            MunicipalAuthorities.waitingQueues.outputMongooseSchemaObject,
            MunicipalAuthorities.waitingQueues.mongoCollectionName);
    }

    public GetQueuesByOfficeId = async (municipalAuthorityId: string) => {
        return this.model.findOne({ municipal_authority_id: municipalAuthorityId });
    }

    public GetOne = async (municipalAuthorityId: string) => {
        return await this.GetQueuesByOfficeId(municipalAuthorityId);
    }

    public GetAll = async () => {
        return this.model.find({});
    }
}
