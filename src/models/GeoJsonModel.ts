import { Document, Model, model, Schema, SchemaDefinition} from "mongoose";
import CustomError from "../helpers/errors/CustomError";
const log = require("debug")("data-platform:output-gateway");

/**
 * General model for Geojson data. Geo-spatial indexing and querying.
 */
export abstract class GeojsonModel {
    /** The Mongoose Model */
    public abstract model: Model<any>;
    /** The schema which contains schemaObject for creating the Mongoose Schema */
    protected abstract schema: Schema;
    /** Selection object to filter the retrieved data */
    private selection: Object = {};

    /**
     * Adds a new selection condition to filter the retrieved results by
     * @param newCondition New condition/filter object to be added to the "where" clause
     */
    private addSelection(newCondition: Object) {
        this.selection = {...this.selection, ...newCondition};
    }

    public constructor() {
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
        // Specify a query filter conditions to search by geometry location
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
        // Specify max range filter condition
        if (range !== undefined) {
            selection.geometry.$near.$maxDistance = range;
        }
        this.addSelection(selection);
        
        return await this.GetAll(limit, offset, updatedSince);
    }

    /** Retrieves all the records from database
     * @param limit Limit
     * @param offset Offset
     * @param updatedSince Filters all results with older last_updated timestamp than this parameter
     * (filters not-updated data)
     * @returns Array of retrieved objects
     */
    public GetAll = async (limit?: number, offset?: number, updatedSince?: number) => {
        try {
            const q = this.model.find({});
            if (updatedSince) {
                this.addSelection({ "properties.timestamp": { $gte: updatedSince } });
            }
            q.where(this.selection);
            if (limit) {
                q.limit(limit);
            }
            if (offset) {
                q.skip(offset);
            }
            this.selection = {};
            const data = await q.exec();
            // Create GeoJSON FeatureCollection output
            return {
                features: data,
                type: "FeatureCollection",
            }
        } catch (err) {
            throw new CustomError("Database error", false, 500, err);
        }
    }
}