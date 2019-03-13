import { Document, Model, model, Schema, SchemaDefinition} from "mongoose";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";

/**
 * General model for GeoJSON data. Geo-spatial indexing and querying. General GetAll and GetOne functions
 *
 * Expects GeoJSON data structure:
 * geometry: { coordinates[], type },
 * properties: { ... }
 * type: Feature
 */
export class GeoJsonModel {
    /** The Mongoose Model */
    public model: Model<any>;
    /** Name of the model */
    protected name: string;
    /** The schema which contains schemaObject for creating the Mongoose Schema */
    protected schema: Schema;
    /** Name of the mongo collection where the model is stored in the database */
    protected collectionName: string|undefined;
    /** Selection object to filter the retrieved records */
    private selection: object = {};
    /** Projection object to filter the retrieved record's attributes */
    private projection: object = {};

    /**
     * Creates a model with specified schema definition
     * @param inName Name of the model - corresponding with mongo collection name (eg. "parkings" for "Parking" model)
     * @param inSchema Schema of the data
     * @param inCollectionName (optional) Name of the mongo collection
     * if empty, collection named as plural of model's name is used
     */
    public constructor(inName: string, inSchema: SchemaDefinition, inCollectionName?: string) {
        this.name = inName;
        this.schema = new Schema(inSchema);
        if (inCollectionName) {
            this.collectionName = inCollectionName;
        }
        // assign existing mongo model or create new one
        try {
            this.model = model(this.name); // existing model
        } catch (error) {
            // create $geonear index
            this.schema.index({ geometry: "2dsphere" });
            // uses database collection named as plural of model's name (eg. "parkings" for "Parking" model)
            // or collection name specified in the third parameter
            this.model = model(this.name, this.schema, this.collectionName);
        }
        // Don't return default mongoose values and mongo internal ID
        this.AddProjection({ _id: 0, __v: 0 });
    }

    /** Retrieves all the records from database
     * @param options Object with options settings, with following properties:
     * lat Latitude to sort results by (by proximity)
     * lng Longitute to sort results by
     * range Maximum range from specified latLng. Only data within this range will be returned.
     * limit Limit
     * offset Offset
     * updatedSince Filters all results with older last_updated timestamp than this parameter
     * (filters not-updated data)
     * additionalFilters Object with additional filter conditions to be added to the selection
     * @returns GeoJSON FeatureCollection with all retrieved objects in "features"
     */
    public GetAll = async ( options: {
                            lat?: number,
                            lng?: number,
                            range?: number,
                            limit?: number,
                            offset?: number,
                            updatedSince?: number,
                            districts?: string[],
                            ids?: number[],
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

    /**
     * Adds a new selection condition to filter the retrieved results by
     * @param newCondition New condition/filter object to be added to the "where" clause
     */
    protected AddSelection = (newCondition: object) => {
        this.selection = { ...this.selection, ...newCondition };
    }

    /**
     * Adds a new projection to filter what attributes to retrieve from the selected objects
     * @param newFilter New filter to be added to the "select" clause
     */
    protected AddProjection = (newFilter: object) => {
        this.projection = { ...this.projection, ...newFilter };
    }

    /**
     * Specify where to search by primary id
     * The entity is uniquely identified by this property
     */
    protected PrimaryIdentifierSelection = (inId: any): object => {
        return { "properties.id": inId };
    }
}
