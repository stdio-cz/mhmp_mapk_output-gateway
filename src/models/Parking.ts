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
    /** Name of the collection where the model is stored in the mongo database */
    protected collection: string;

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
                    id: { type: Number, required: true },
                    last_updated: { type: String, required: true },
                    name: { type: String, required: true },
                    num_of_free_places: { type: Number, required: true },
                    num_of_taken_places: { type: Number, required: true },
                    parking_type: {
                        description: { type: String, required: true },
                        id: { type: Number, required: true },
                    },
                    total_num_of_places: { type: Number, required: true },
                },
                type: { type: String, required: true },
        });

        this.collection = "prparkings";

        // assign existing mongo model or create new one
        try {
            this.model = model("Parking");
          } catch (error) {
            this.model = model("Parking", this.schema, this.collection);
          }
    }

    /** Retrieves all the records from database
     * @returns Array of retrieved objects
     */
    public GetAll = async (limit?: number, offset?: number) => {
        const q = this.model.find({});
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
     * @returns Array of retrieved objects
     */
    public GetByCoordinates = async (lat: number, lng: number, range?: number, limit?: number, offset?: number ) => {
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
