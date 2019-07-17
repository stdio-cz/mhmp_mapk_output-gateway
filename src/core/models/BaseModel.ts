/**
 * Base model class, defines basic structure of a model. GetAll, GetOne functions, mandatory name
 *
 * Model /DATA ACCESS LAYER/: Defines data structure, connects to DB storage and retrieves data directly from database.
 * Performs database queries.
 */
export abstract class BaseModel {

    public abstract GetAll: (options?: any) => Promise<any>;
    public abstract GetOne: (id: any) => Promise<any>;

    /** Name of the model */
    protected name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    public GetName = (): string => {
        return this.name;
    }
}
