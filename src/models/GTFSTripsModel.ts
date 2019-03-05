import {RopidGTFS} from "data-platform-schema-definitions";
import moment = require("moment");
import * as Sequelize from "sequelize";
import CustomError from "../helpers/errors/CustomError";
import log from "../helpers/Logger";
import sequelizeConnection from "../helpers/PostgreDatabase";
import {models as sequelizeModels} from "./index";

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
                                   date?: string,
                               } = {},
    ): Promise<any> => {
        const {limit, offset, stopId, stops, stopTimes, shapes, service, route, date} = options;
        try {
            const include: any = [];
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

            if (date || service) {
                const where: any = {[sequelizeConnection.Op.and]: []};
                if (date) {
                    const day = moment(date).day();
                    where[sequelizeConnection.Op.and].push(
                        sequelizeConnection.literal(
                            `DATE('${date}') BETWEEN to_date(start_date, 'YYYYMMDD') AND to_date(end_date, 'YYYYMMDD')`,
                        ));
                    where[sequelizeConnection.Op.and].push(
                        {[sequelizeModels.GTFSCalendarModel.weekDayMap[day]]: 1},
                    );
                }
                include.push({
                    as: "service",
                    model:
                        sequelizeConnection.models[RopidGTFS.calendar.pgTableName],
                    ...
                        (date && {
                                where,
                            }
                        ),
                });
            }

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
            if (stops) {
                return data.map((trip) => {
                    trip.stops = trip.stops.map(sequelizeModels.GTFSStopModel.buildResponse);
                    return trip;
                });
            }

            return data;
        } catch (err) {
            console.log(err);
            throw new CustomError("Database error", true, 500, err);
        }
    }

    public GetOne = async (id: string): Promise<object> => {
        return this.sequelizeModel.findByPk(id);
    }
}
