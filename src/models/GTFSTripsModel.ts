import {RopidGTFS} from "data-platform-schema-definitions";
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";

/**
 * TODO
 */
export class GTFSTripsModel {
    /** The Sequelize Model */
    protected sequelizeModel: Sequelize.Model<any, any>;
    /** Name of the model */
    protected name: string;

    public constructor() {
        this.name = RopidGTFS.trips.name;
        this.sequelizeModel = sequelizeConnection.define(RopidGTFS.trips.pgTableName,
            RopidGTFS.trips.outputSequelizeAttributes,
        );
    }

    public Associate = (models: any) => {

        this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
            as: "has_stop_id",
            foreignKey: "trip_id",
        });

        this.sequelizeModel.hasMany(models.GTFSStopTimesModel.sequelizeModel, {
            as: "stop_times",
            foreignKey: "trip_id",
        });

        this.sequelizeModel.belongsTo(models.GTFSCalendarModel.sequelizeModel, {
            as: "service",
            foreignKey: "service_id",
        });

        this.sequelizeModel.belongsTo(models.GTFSRoutesModel.sequelizeModel, {
            as: "route",
            foreignKey: "route_id",
        });

        this.sequelizeModel.hasMany(models.GTFSShapesModel.sequelizeModel, {
            as: "shapes",
            foreignKey: "shape_id",
            sourceKey: "shape_id",
        });

        this.sequelizeModel.belongsToMany(models.GTFSStopModel.sequelizeModel, {
            as: "stops",
            foreignKey: "trip_id",
            otherKey: "stop_id",
            through: models.GTFSStopTimesModel.sequelizeModel,
        });
    }

    public GetAll = async (options:
                               {
                                   limit?: number,
                                   offset?: number,
                                   route?: boolean,
                                   stopId?: string,
                                   shapes?: boolean,
                                   service?: boolean,
                                   stops?: boolean,
                                   stopTimes?: boolean,
                               } = {},
    ): Promise<any> => {
        const {limit, offset, stopId, stops, stopTimes, shapes, service, route} = options;
        try {
            const include = [];
            if (stopId) {
                include.push({
                    as: "has_stop_id",
                    attributes: [],
                    model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
                    where: {
                        stop_id: stopId,
                    },
                });
            }

            stops && include.push({
                as: "stops",
                model: sequelizeConnection.models[RopidGTFS.stops.pgTableName],
                through: {attributes: []},
            });

            stopTimes && include.push({
                as: "stop_times",
                model: sequelizeConnection.models[RopidGTFS.stop_times.pgTableName],
            });

            shapes && include.push({
                as: "shapes",
                model: sequelizeConnection.models[RopidGTFS.shapes.pgTableName],
            });

            service && include.push({
                as: "service",
                model: sequelizeConnection.models[RopidGTFS.calendar.pgTableName],
            });

            route && include.push({
                as: "route",
                model: sequelizeConnection.models[RopidGTFS.routes.pgTableName],
            });

            const data = await this.sequelizeModel.findAll({
                include,
                limit,
                offset,
                order: [["trip_id", "DESC"]],
            });
            return {
                features: data,
                type: "FeatureCollection",
            };
        } catch (err) {
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string): Promise<object> => {
        return this.sequelizeModel.findByPk(id);
    }
}
