import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import {buildResponse} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSStopModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.stops.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.stops.pgTableName,
            RopidGTFS.stops.outputSequelizeAttributes);
    }

    public Associate = (models: any) => {
        // this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
        //     foreignKey: "trip_id",
        // });
    }

    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        lat?: number,
        lng?: number,
        range?: number,
    } = {}): Promise<any> => {
        const {limit, offset, lat, lng, range} = options;
        try {

            const order: any = [];
            const attributes: any = Object.keys(RopidGTFS.stops.outputSequelizeAttributes);
            let where: any = {};
            if (lat && lng) {
                const location = Sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
                const distance = Sequelize
                    .fn("ST_Distance_Sphere", Sequelize.literal("ST_MakePoint(stop_lon, stop_lat)"), location);
                attributes.push([distance, "distance"]);
                order.push([[Sequelize.literal("distance"), "asc"]]);
                if (range) {
                    where = Sequelize.where(distance, "<=", range);
                }
            }

            order.push([["stop_id", "asc"]]);
            const data = await this.sequelizeModel.findAll({
                attributes,
                limit,
                offset,
                order,
                where,
            });
            return {
                features: data.map((item) => buildResponse(item, "stop_lon", "stop_lat")),
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
                return buildResponse(data, "stop_lon", "stop_lat");
            }
            return null;
        })
}
