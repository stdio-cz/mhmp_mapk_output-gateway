import {RopidGTFS} from "data-platform-schema-definitions";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import {SequelizeModel} from "./SequelizeModel";

export class GTFSShapesModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.shapes.name, RopidGTFS.shapes.pgTableName,
            RopidGTFS.shapes.outputSequelizeAttributes);
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
                features: data.map((item) => buildResponse(item, "shape_pt_lon", "shape_pt_lat")),
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
