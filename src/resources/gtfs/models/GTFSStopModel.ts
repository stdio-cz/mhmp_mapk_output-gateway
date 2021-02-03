import { CustomError } from "@golemio/errors";
import { RopidGTFS } from "@golemio/schema-definitions";
import * as Sequelize from "sequelize";
import { sequelizeConnection } from "../../../core/database";
import { buildGeojsonFeature, buildGeojsonFeatureCollection } from "../../../core/Geo";
import { SequelizeModel } from "../../../core/models";

export class GTFSStopModel extends SequelizeModel {
    protected outputAttributes: string[] = [];
    protected cisStopsModel: Sequelize.Model<any, any>;

    public constructor() {
        super(RopidGTFS.stops.name, RopidGTFS.stops.pgTableName,
            RopidGTFS.stops.outputSequelizeAttributes);

        this.outputAttributes = Object.keys(RopidGTFS.stops.outputSequelizeAttributes);

        const notUsedColumns = [
            "stop_code",
            "stop_desc",
            "stop_url",
            "stop_timezone",
        ];
        notUsedColumns.forEach((column) => {
            this.sequelizeModel.removeAttribute(column);
            this.outputAttributes.splice(this.outputAttributes.indexOf(column), 1);
        });

        const auditColumns = [
            "created_by",
            "update_batch_id",
            "create_batch_id",
            "updated_by",
            "created_at",
            "updated_at",
        ];
        auditColumns.forEach((column) => {
            this.sequelizeModel.removeAttribute(column);
            this.outputAttributes.splice(this.outputAttributes.indexOf(column), 1);
        });

        this.cisStopsModel = sequelizeConnection.define(
            RopidGTFS.cis_stops.pgTableName,
            RopidGTFS.cis_stops.outputSequelizeAttributes,
        );
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
        names?: string[],
        gtfsIds?: string[],
        aswIds?: string[],
        cisIds?: number[],
        locationType?: number,
        appendAswId?: boolean,
        returnRaw?: boolean,
    } = {}): Promise<any> => {
        const { limit, offset, lat, lng, range,
            names, gtfsIds, aswIds, cisIds,
            locationType, appendAswId, returnRaw } = options;
        try {
            const allGtfsIds: string[] = [];
            const order: any = [];
            const attributes: any = this.outputAttributes;
            let where: any = {};
            if (lat && lng) {
                const location = Sequelize.literal(`ST_GeomFromText('POINT(${lng} ${lat})')`);
                const distance = Sequelize
                    .fn("ST_DistanceSphere", Sequelize.literal("ST_MakePoint(stop_lon, stop_lat)"), location);
                attributes.push([distance, "distance"]);
                order.push([[Sequelize.literal("distance"), "asc"]]);
                if (range) {
                    where = Sequelize.where(distance, "<=", range);
                }
            }

            if (aswIds || cisIds) {
                const ors: any[] = [];
                if (aswIds && aswIds?.length > 0) {
                    aswIds.forEach((d) => {
                        // user can pass "/" sign encoded, or it could be passed as "_"
                        let aswIdLike = d.replace("_", "/");

                        // if user pass "/" and nothing after, strip the slash
                        if (aswIdLike.indexOf("/") === aswIdLike.length - 1) {
                            aswIdLike = aswIdLike.substring(0, aswIdLike.length - 1);
                        }

                        // user can pass only the first part of ASW ID, i.e. 85 for stops 85/1, 85/2, but not 856/1.
                        if (aswIdLike.indexOf("/") < 0) {
                            aswIdLike += "/%";
                            ors.push(Sequelize.where(Sequelize.col("id"), "LIKE", aswIdLike));
                        } else {
                            ors.push(Sequelize.where(Sequelize.col("id"), "=", aswIdLike));
                        }
                    });
                }
                if (cisIds && cisIds?.length > 0) {
                    ors.push({
                        cis: cisIds,
                    });
                }

                const stops = await this.cisStopsModel.findAll({
                    raw: true,
                    where: {
                        [Sequelize.Op.or]: ors,
                    },
                });

                // after all stops by other than GTFS ids are collected, we create proper GTFS ids with % like sign.
                // GTFS stops must be split into more ids due to more tarriff zones even if it is one physical stop.
                stops.forEach((stop) => {
                    allGtfsIds.push("U" + stop.id.replace("/", "Z") + "(P|N)?(_\\d+)?");
                });

                // If aswIds and cisIds are not belong to any GTFS ids and no other gtfsIds or names are given,
                // then return empty stops array
                if (ors.length > 0 && allGtfsIds.length === 0 &&
                    (gtfsIds === undefined || gtfsIds?.length === 0) &&
                    (names === undefined || names.length === 0)) {
                    return returnRaw ? [] : buildGeojsonFeatureCollection([], "stop_lon", "stop_lat", true);
                }
            }

            gtfsIds?.forEach((stop) => {
                allGtfsIds.push(stop);
            });

            where.stop_id = {
                [Sequelize.Op.or]: allGtfsIds.map((id) => {
                    return Sequelize.where(Sequelize.col("stop_id"), "SIMILAR TO", id);
                }),
            };

            if (names && names?.length > 0) {
                where.stop_name = names;
            }

            if (locationType !== undefined) {
                where.location_type = locationType;
            }

            order.push([["stop_id", "asc"]]);

            let data = await this.sequelizeModel.findAll({
                attributes,
                limit,
                offset,
                order,
                raw: true,
                where,
            });

            if (appendAswId) {
                data = data.map((row) => {
                    row.asw_id = this.parseAswId(row.stop_id);
                    return row;
                });
            }

            return returnRaw ? data : buildGeojsonFeatureCollection(data, "stop_lon", "stop_lat", true);
        } catch (err) {
            throw new CustomError("Database error", true, "GTFSStopModel", 500, err);
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
                return buildGeojsonFeature(data, "stop_lon", "stop_lat", true);
            }
            return null;
        })

    /** Parses stop ASW id from GTFS id
     * @param {string} id Id of the stop
     * @returns {string} id ASW id of the stop
     */
    public parseAswId = (gtfsId: string): {
        node: number,
        stop: number,
    } | null => {
        const matches = gtfsId.match(/U(\d+)Z(\d+)/);
        if (matches) {
            return {
                node: parseInt(matches[1], 10),
                stop: parseInt(matches[2], 10),
            };
        } else {
            return null;
        }
    }
}
