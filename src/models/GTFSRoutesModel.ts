import {RopidGTFS} from "data-platform-schema-definitions";
import CustomError from "../helpers/errors/CustomError";
import {SequelizeModel} from "./SequelizeModel";

export class GTFSRoutesModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.routes.name, RopidGTFS.routes.pgTableName,
            RopidGTFS.routes.outputSequelizeAttributes);
    }

    public GetAll = async (options: {
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const {limit, offset} = options;
        try {

            const order: any = [];

            order.push([["route_id", "asc"]]);
            const data = await this.sequelizeModel.findAll({
                limit,
                offset,
                order,
            });
            return data;
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string): Promise<any> => this
        .sequelizeModel
        .findByPk(id)
}
