import { CustomError } from "@golemio/errors";
import { BicycleCounters } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { IBicycleCountersModels, ILocation } from ".";
import { sequelizeConnection } from "../../../core/database";
import { SequelizeModel } from "./../../../core/models/";

export class BicycleCountersLocationsModel extends SequelizeModel {

    public constructor() {
        super(BicycleCounters.locations.name, BicycleCounters.locations.pgTableName,
            BicycleCounters.locations.outputSequelizeAttributes);

        this.sequelizeModel.removeAttribute("vendor_id");
        this.sequelizeModel.removeAttribute("update_batch_id");
        this.sequelizeModel.removeAttribute("create_batch_id");
        this.sequelizeModel.removeAttribute("updated_by");
        this.sequelizeModel.removeAttribute("created_at");
    }

    public Associate = (model: IBicycleCountersModels) => {
        this.sequelizeModel.hasMany(model.BicycleCountersDirectionsModel.sequelizeModel, {
            as: "directions",
            foreignKey: "locations_id",
        });

    }

    /**
     * @param {object} [options] Options object with params
     * @param {number} [options.limit] Limit
     * @param {number} [options.offset] Offset
     * @param {number} [options.lat] Latitude to sort results by (by proximity)
     * @param {number} [options.lng] Longitute to sort results by
     * @param {number} [options.range] Maximum range from specified latLng. <br>
     *     Only data within this range will be returned.
     * @returns Array of the retrieved records
     */
    public GetAll = async (options: {
        limit?: number,
        offset?: number,
        lat?: number,
        lng?: number,
        range?: number,
    } = {}): Promise<ILocation[]> => {
        const { limit, offset, lat, lng, range } = options;
        try {
            const order: any[] = [];
            const attributes: any[] =  ["id", "name", "route", "updated_at", "lng", "lat"];
            const include = [{
                as: "directions",
                attributes: ["id", "name"],
                model: sequelizeConnection.models[BicycleCounters.directions.pgTableName],
            }];
            let where: any = {};
            if (lat && lng) {
                const location = Sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
                const distance = Sequelize
                    .fn("ST_Distance_Sphere", Sequelize.literal("ST_MakePoint(lng, lat)"), location);

                attributes.push([distance, "distance"]);
                order.push([Sequelize.literal("distance"), "asc"]);

                if (range) {
                    where = Sequelize.where(distance, "<=", range);
                }
            }

            order.push(["id", "asc"]);

            const data = await this.sequelizeModel.findAll({
                attributes,
                include,
                limit,
                offset,
                order,
                raw: true,
                where,
            });

            return data;
        } catch (err) {
            throw new CustomError("Database error", true, "BicycleCountersLocationsModel", 500, err);
        }
    }

    public GetOne = async (id: number): Promise<object | null> => {
        return null;
    }

}
