/**
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */

import { Document, Model, model, Schema, SchemaDefinition} from "mongoose";
const log = require("debug")("data-platform:output-gateway");

export default class Parking {
    /** The Mongoose Model */
    public model: Model<any>;
    /** The schema which contains schemaObject for creating the Mongoose Schema */
    protected schema: Schema;

    /**
     * Instantiates the model according to the given schema.
     */
    constructor() {
        this.schema = new Schema({
                geometry: {
                    coordinates: { type: Array, required: true },
                    type: { type: String, required: true },
                },
                properties: {
                    address: { type: String },
                    district: { type: String },
                    id: { type: Number, required: true },
                    name: { type: String, required: true },
                    num_of_free_places: { type: Number, required: true },
                    num_of_taken_places: { type: Number, required: true },
                    parking_type: {
                        description: { type: String, required: true },
                        id: { type: Number, required: true },
                    },
                    timestamp: { type: Number, required: true },
                    total_num_of_places: { type: Number, required: true },
                },
                type: { type: String, required: true },
        });

        // assign existing mongo model or create new one
        try {
            this.model = model("Parking");
          } catch (error) {
            // uses "parkings" database collection (plural of model's name)
            // to specify different one, pass it as 3rd parameter
            this.model = model("Parking", this.schema);
          }
    }

    /** Retrieves all the records from database
     * @param limit Limit
     * @param offset Offset
     * @param updatedSince Filters all results with older last_updated timestamp than this parameter
     * @returns Array of retrieved objects
     */
    public GetAll = async (limit?: number, offset?: number, updatedSince?: number) => {
        const q = this.model.find({});
        if (updatedSince) {
            const selection = { "properties.last_updated": { $gte: updatedSince } };
            q.where(selection);
        }
        if (limit) {
            q.limit(limit);
        }
        if (offset) {
            q.skip(offset);
        }
        return await q.exec();
    }

    /** Retrieves one record from database
     * @param inId Id of the record to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (inId: number): Promise<object> => {
        return await this.model.findOne({"properties.id": inId}).exec();
    }

    /**
     * Retrieves data from database based on coordinates.
     * @param lat Latitude to sort results by (by proximity)
     * @param lng Longitute to sort results by
     * @param range Maximum range from specified latLng. Only data within this range will be returned.
     * @param limit Limit
     * @param offset Offset
     * @param updatedSince Filters all results with older last_updated timestamp than this parameter
     * (filters not-updated data)
     * @returns Array of retrieved objects
     */
    public GetByCoordinates = async (   lat: number,
                                        lng: number,
                                        range?: number,
                                        limit?: number,
                                        offset?: number,
                                        updatedSince?: number,
    ) => {
        // Specify a query to search by geometry location
        const selection: any = {
            geometry: {
                $near: {
                    $geometry: {
                        coordinates: [ lng, lat ],
                        type: "Point",
                    },
                },
            },
        };
        if (range !== undefined) {
            selection.geometry.$near.$maxDistance = range;
        }
        if (updatedSince) {
            selection["properties.last_updated"] = { $gte: updatedSince };
        }
        const q = this.model.find({}).where(selection);
        if (limit) {
            q.limit(limit);
        }
        if (offset) {
            q.skip(offset);
        }
        return await q.exec();
    }
}
