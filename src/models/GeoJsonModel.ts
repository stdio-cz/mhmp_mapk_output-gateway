import {SchemaDefinition} from "mongoose";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import {MongoModel} from "./MongoModel";

/**
 * General model for GeoJSON data. Geo-spatial indexing and querying. General GetAll and GetOne functions
 *
 * Expects GeoJSON data structure:
 * geometry: { coordinates[], type },
 * properties: { ... }
 * type: Feature
 */
export class GeoJsonModel extends MongoModel {

    /**
     * Creates a model with specified schema definition
     * @param inName Name of the model - corresponding with mongo collection name (eg. "parkings" for "Parking" model)
     * @param inSchema Schema of the data
     * @param inCollectionName (optional) Name of the mongo collection
     * if empty, collection named as plural of model's name is used
     */
    public constructor(inName: string, inSchema: SchemaDefinition, inCollectionName?: string) {
        super(inName, inSchema, inCollectionName);

        // create $geonear index
        this.schema.index({geometry: "2dsphere"});
    }

    /** Retrieves all the records from database
     * @param lat Latitude to sort results by (by proximity)
     * @param lng Longitute to sort results by
     * @param range Maximum range from specified latLng. Only data within this range will be returned.
     * @param limit Limit
     * @param offset Offset
     * @param updatedSince Filters all results with older last_updated timestamp than this parameter
     * (filters not-updated data)
     * @param additionalFilters Object with additional filter conditions to be added to the selection
     * @returns GeoJSON FeatureCollection with all retrieved objects in "features"
     */
        // TODO: change params to options = {}
    public GetAll = async (lat?: number,
                           lng?: number,
                           range?: number,
                           limit?: number,
                           offset?: number,
                           updatedSince?: number,
                           districts?: string[],
                           ids?: number[],
                           additionalFilters?: object) => {
        try {
            const q = this.model.find({});

            // Specify a query filter conditions to search by geometry location
            if (lat) {
                const selection: any = {
                    geometry: {
                        $near: {
                            $geometry: {
                                coordinates: [lng, lat],
                                type: "Point",
                            },
                        },
                    },
                };
                // Specify max range filter condition
                if (range !== undefined) {
                    selection.geometry.$near.$maxDistance = range;
                }
                this.AddSelection(selection);
            }

            // Specify a query filter conditions to search by last updated time
            if (updatedSince) {
                this.AddSelection({"properties.timestamp": {$gte: updatedSince}});
            }

            // Specify a query filter conditions to search by districts
            if (districts) {
                this.AddSelection({"properties.district": {$in: districts}});
            }

            // Specify a query filter conditions to search by IDs
            if (ids) {
                this.AddSelection(this.PrimaryIdentifierSelection({$in: ids}));
            }

            // Specify a query filter conditions to search by additional filter parameters
            if (additionalFilters) {
                this.AddSelection(additionalFilters);
            }

            q.where(this.selection);
            if (limit) {
                q.limit(limit);
            }
            if (offset) {
                q.skip(offset);
            }
            q.select(this.projection);
            this.selection = {};
            const data = await q.exec();
            // Create GeoJSON FeatureCollection output
            return {
                features: data,
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", false, 500, err);
        }
    }

    /** Retrieves one record from database
     * @param inId Id of the record to be retrieved
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (inId: any): Promise<object> => {
        const found = await this.model.findOne(this.PrimaryIdentifierSelection(inId), "-_id -__v").exec();
        if (!found || found instanceof Array && found.length === 0) {
            log.debug("Could not find any record by following selection:");
            log.debug(this.PrimaryIdentifierSelection(inId));
            throw new CustomError("Id `" + inId + "` not found", true, 404);
        } else {
            return found;
        }
    }
}
