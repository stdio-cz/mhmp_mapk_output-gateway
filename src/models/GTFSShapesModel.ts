import { RopidGTFS } from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import { buildResponse } from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSShapesModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.shapes.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.shapes.pgTableName,
            RopidGTFS.shapes.outputSequelizeAttributes,
        );
    }

    public Associate = (models: any) => {
        this.sequelizeModel.hasMany(models.GTFSTripsModel.sequelizeModel, {
            foreignKey: "trip_id",
        });
    }

    public GetAll = async (options: {
        limit?: number,
        offset?: number,
    } = {}): Promise<any> => {
        const {limit, offset} = options;
        try {

            const order: any = [];

            order.push([["shape_id", "asc"]]);
            const data = await this.sequelizeModel.findAll({
                limit,
                offset,
                order,
            });
            return {
                features: data.map((item) => buildResponse(item,  "shape_pt_lon", "shape_pt_lat")),
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string): Promise<any> => this
        .sequelizeModel
        .findByPk(id)
        .then((data) => {
            if (data) {
                return buildResponse(data, "shape_pt_lon", "shape_pt_lat");
            }
            return null;
        })
}
