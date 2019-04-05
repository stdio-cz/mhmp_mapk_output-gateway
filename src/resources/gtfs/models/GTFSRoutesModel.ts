import { RopidGTFS } from "data-platform-schema-definitions";
import { CustomError } from "../../../core/errors";
import { SequelizeModel } from "../../../core/models";

export class GTFSRoutesModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.routes.name, RopidGTFS.routes.pgTableName,
            RopidGTFS.routes.outputSequelizeAttributes);
    }

    /** Retrieves all gtfs routes
     * @param {object} [options] Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @returns Array of the retrieved records
     */
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

    /** Retrieves specific gtfs routes
     * @param {string} id Id of the route
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string): Promise<any> => this
        .sequelizeModel
        .findByPk(id)
}
