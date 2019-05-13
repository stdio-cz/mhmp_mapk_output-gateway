import { SchemaDefinition } from "mongoose";
import { CustomError } from "../errors";
import { buildGeojsonFeature, buildGeojsonFeatureCollection } from "../Geo";
import { log } from "../Logger";
import { MongoModel } from "./";

/**
 * General model for GeoJSON data. Geo-spatial indexing and querying. Implements general GetAll and GetOne functions
 *
 * Expects GeoJSON data structure:
 *
 * geometry: { coordinates[], type },
 *
 * properties: { ... }
 *
 * type: Feature
 *
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
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
     * @param options Object with options settings, with following properties.
     * @param options.lat Latitude to sort results by (by proximity)
     * @param options.lng Longitute to sort results by
     * @param options.range Maximum range from specified latLng. Only data within this range will be returned.
     * @param options.limit Limit
     * @param options.offset Offset
     * @param options.updatedSince Filters all results with older last_updated timestamp than this parameter
     * (filters not-updated data)
     * @param options.additionalFilters Object with additional filter conditions to be added to the selection
     * @returns GeoJSON FeatureCollection with all retrieved objects in "features"
     */
    public GetAll = async ( options: {
                            /** Latitude to sort results by (by proximity) */
                            lat?: number,
                            /** Longitute to sort results by */
                            lng?: number,
                            /** Maximum range from specified latLng. Only data within this range will be returned. */
                            range?: number,
                            /** Limit (can be used for pagination). Evaluated last, after all filters applied. */
                            limit?: number,
                            /** Offset (can be used for pagination). Evaluated last, after all filters applied. */
                            offset?: number,
                            /** Filters all results with older last_updated timestamp than this parameter
                             * (filters not-updated data)
                             */
                            updatedSince?: number,
                            /** Filters the data to include only these with one of the specified "district" value */
                            districts?: string[],
                            /** Filters the data to include only specified IDs */
                            ids?: number[],
                            /** Object with additional filter conditions to be added to the selection */
                            additionalFilters?: object,
    } = {} ) => {
        try {
            const q = this.model.find({});

            // Specify a query filter conditions to search by geometry location
            if (options.lat) {
                const selection: any = {
                    geometry: {
                        $near: {
                            $geometry: {
                                coordinates: [ options.lng, options.lat ],
                                type: "Point",
                            },
                        },
                    },
                };
                // Specify max range filter condition
                if (options.range !== undefined) {
                    selection.geometry.$near.$maxDistance = options.range;
                }
                this.AddSelection(selection);
            }

            // Specify a query filter conditions to search by last updated time
            if (options.updatedSince) {
                this.AddSelection({ "properties.timestamp": { $gte: options.updatedSince } });
            }

            // Specify a query filter conditions to search by districts
            if (options.districts) {
                this.AddSelection({ "properties.district": { $in: options.districts } });
            }

            // Specify a query filter conditions to search by IDs
            if (options.ids) {
                this.AddSelection(this.PrimaryIdentifierSelection({$in: options.ids}));
            }

            // Specify a query filter conditions to search by additional filter parameters
            if (options.additionalFilters) {
                this.AddSelection(options.additionalFilters);
            }

            q.where(this.selection);
            if (options.limit) {
                q.limit(options.limit);
            }
            if (options.offset) {
                q.skip(options.offset);
            }
            q.select(this.projection);

            log.silly("Executing query with selection: ");
            log.silly(this.selection);

            this.selection = {};

            const data = await q.exec();
            // Create GeoJSON FeatureCollection output
            return buildGeojsonFeatureCollection(data);
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
