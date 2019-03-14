import CustomError from "../helpers/errors/CustomError";

export abstract class BaseModel {
    /** Name of the model */
    protected name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    public GetAll = (options?: any): Promise<any> => {
        throw new CustomError("Method not implemented", false);
    }

    public GetOne = (id: any): Promise<any> => {
        throw new CustomError("Method not implemented", false);
    }
}
