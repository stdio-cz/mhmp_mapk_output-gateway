import { MunicipalAuthorities } from "@golemio/schema-definitions";
import * as moment from "moment";
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
        const data = await this.model.findOne({ municipal_authority_id: municipalAuthorityId }).lean();
        data.last_updated ? data.last_updated = moment(data.last_updated).toISOString() : {};
        data.updated_at ? data.updated_at = moment(data.updated_at).toISOString() : {};
        return data;
    }

    public GetOne = async (municipalAuthorityId: string) => {
        return this.GetQueuesByOfficeId(municipalAuthorityId);
    }

    public GetAll = async () => {
        return this.model.find({}).lean();
    }
}
