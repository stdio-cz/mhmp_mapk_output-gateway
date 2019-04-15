import {RopidGTFS} from "golemio-schema-definitions";
import * as Sequelize from "sequelize";
import {sequelizeConnection} from "../../../core/database";
import {CustomError} from "../../../core/errors";
import {buildGeojsonFeature, buildGeojsonFeatureCollection} from "../../../core/Geo";
import { log } from "../../../core/Logger";
import {SequelizeModel} from "../../../core/models";

export class GTFSStopModel extends SequelizeModel {

    public constructor() {
        super(RopidGTFS.stops.name, RopidGTFS.stops.pgTableName,
            RopidGTFS.stops.outputSequelizeAttributes);
    }

    /** Retrieves all gtfs stops
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

            log.debug(attributes);
            const attrWithExclude: {exclude: string[], include: string[]} = {
                exclude: [  "created_by",
                            "updated_by",
                            "created_at",
                            "updated_at",
                            "create_batch_id",
                            "update_batch_id"],
                include: attributes,
            };

            const data = await this.sequelizeModel.findAll({
                attributes: attrWithExclude,
                limit,
                offset,
                order,
                where,
            });
            return buildGeojsonFeatureCollection(data, "stop_lon", "stop_lat");
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    /** Retrieves specific gtfs stop
     * @param {string} id Id of the stop
     * @returns Object of the retrieved record or null
     */
    public GetOne = async (id: string): Promise<any> => this
        .sequelizeModel
        .findByPk(id)
        .then((data) => {
            if (data) {
                return buildGeojsonFeature(data, "stop_lon", "stop_lat");
            }
            return null;
        })
}
