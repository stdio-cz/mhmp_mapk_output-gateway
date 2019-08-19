import { Model, model, Schema, SchemaDefinition } from "mongoose";
import { BaseModel } from "./";

/**
 * General model for data stored in MongoDB.
 *
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */
export abstract class MongoModel extends BaseModel {
    /** The Mongoose Model */
    public model: Model<any>;
    /** The Mongoose Schema object, defining structure of the data */
    protected schema: Schema;
    /** Name of the mongo collection where the model is stored in the database */
    protected collectionName: string | undefined;
    /** Selection object to filter the retrieved records */
    protected selection: object = {};
    /** Projection object to filter the retrieved record's attributes */
    protected projection: object = {};

    /**
     * Creates a model with specified schema definition
     * @param inName Name of the model - corresponding with mongo collection name (eg. "parkings" for "Parking" model)
     * @param inSchema Schema of the data
     * @param inCollectionName (optional) Name of the mongo collection
     * if empty, collection named as plural of model's name is used
     */
    public constructor(inName: string, inSchema: SchemaDefinition, inCollectionName?: string) {
        super(inName);
        this.name = inName;
        this.schema = new Schema(inSchema);
        if (inCollectionName) {
            this.collectionName = inCollectionName;
        }
        // assign existing mongo model or create new one
        try {
            this.model = model(this.name); // existing model
        } catch (error) {
            // uses database collection named as plural of model's name (eg. "parkings" for "Parking" model)
            // or collection name specified in the third parameter
            this.model = model(this.name, this.schema, this.collectionName);
        }
        // Don't return default mongoose values and mongo internal ID
        this.AddProjection({_id: 0, __v: 0});
    }

    /**
     * Returns current schema of the data
     */
    public GetSchema = async () => {
        return this.schema;
    }

    // TODO: Careful, Router takes this keys()[0] as a decision, if ID parameter can be string or number,
    // that's weird dependency - selection with $or on two attributes for example will fail!
    /**
     * Specifies where is the primary ID of the entity.
     * Searches by this selection in FindOne()
     */
    public PrimaryIdentifierSelection = (inId: any): object => {
        return {"properties.id": inId};
    }

    /**
     * Adds a new selection condition to filter the retrieved results by
     * @param newCondition New condition/filter object to be added to the "where" clause
     */
    protected AddSelection = (newCondition: object) => {
        this.selection = {...this.selection, ...newCondition};
    }

    /**
     * Adds a new projection to filter what attributes to retrieve from the selected objects
     * @param newFilter New filter to be added to the "select" clause
     */
    protected AddProjection = (newFilter: object) => {
        this.projection = {...this.projection, ...newFilter};
    }
}