import { IceGatewaySensors } from "golemio-schema-definitions";
import { SchemaDefinition } from "mongoose";
import { CustomError } from "../../core/errors";
import { MongoModel } from "../../core/models";
import { log } from "../Logger";

export class HistoryModel extends MongoModel {

    /**
     * Location of the property by which to filter (from-to) and sort the data according to time
     */
    protected primaryTimePropertyLocation: string = "updated_at";

    /**
     * Location of the property by which to filter the data according to sensor id
     */
    protected primarySensorIdPropertyLocation: string = "id";

    /**
     * Instantiates the model according to the given schema.
     */
    public constructor(
        inName: string,
        inSchema: SchemaDefinition,
        inCollectionName?: string,
        timePropertyLocation?: string,
        sensorIdPropertyLocation?: string,
    ) {
        super(inName, inSchema, inCollectionName);
        if (timePropertyLocation) {
            this.primaryTimePropertyLocation = timePropertyLocation;
        }
        if (sensorIdPropertyLocation) {
            this.primarySensorIdPropertyLocation = sensorIdPropertyLocation;
        }
    }

    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        from?: number,
        to?: number,
        sensorId?: string | number,
    }) => {
        const q = this.model.find();
        if (options.limit) {
            q.limit(options.limit);
        }
        if (options.offset) {
            q.skip(options.offset);
        }
        if (options.from) {
            q.where({ [this.primaryTimePropertyLocation]: { $gt: options.from } });
        }
        if (options.to) {
            q.where({ [this.primaryTimePropertyLocation]: { $lt: options.to } });
        }
        if (options.sensorId != null) {
            q.where([this.primarySensorIdPropertyLocation], options.sensorId);
        }
        q.select(this.projection);
        q.sort({ [this.primaryTimePropertyLocation]: -1 });
        return await q.exec();
    }

    public PrimaryIdentifierSelection = (inId: any): object => {
        return { id: inId };
    }

    /**
     *  Get one historical entry
     * @param inId Id of the record to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId), this.projection).exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by following selection:");
            log.debug(this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else {
            return found;
        }
    }
}
