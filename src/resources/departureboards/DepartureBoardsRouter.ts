/**
 * app/routers/DepartureBoardsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { oneOf, query } from "express-validator/check";
import * as moment from "moment-timezone";
import { IDeparture } from ".";
import { useCacheMiddleware } from "../../core/redis";
import { BaseRouter } from "../../core/routes/BaseRouter";
import {
    checkErrors,
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";
import { DepartureBoardsModel } from "./DepartureBoardsModel";

export class DepartureBoardsRouter extends BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected departureBoardsModel: DepartureBoardsModel;

    public constructor() {
        super();
        this.departureBoardsModel = new DepartureBoardsModel();
        this.initRoutes();
    }

    public GetDepartureBoard = async (req: Request, res: Response, next: NextFunction) => {
        const aswIds: string[] = this.ConvertToArray(req.query.aswIds || []);
        const cisIds: number[] = this.ConvertToArray(req.query.cisIds || []);
        const gtfsIds: string[] = this.ConvertToArray(req.query.ids || []);
        const names: string[] = this.ConvertToArray(req.query.names || []);

        // set preferred timezone if exists in library (possible to use _ sign instead of URL encoded / sign)
        // default is UTC zulu format
        let preferredTimezone = "UTC";
        if (req.query.preferredTimezone && moment.tz.names().includes(req.query.preferredTimezone.replace(/_/g, "/"))) {
            preferredTimezone = req.query.preferredTimezone;
        }

        try {

            const data = await this.departureBoardsModel
                .GetAll({
                    aswIds,
                    cisIds,
                    gtfsIds,
                    limit: parseInt(req.query.limit || 20, 10),
                    minutesAfter: parseInt(req.query.minutesAfter || 180, 10),
                    minutesBefore: parseInt(req.query.minutesBefore || 0, 10),
                    names,
                    offset: req.query.offset,
                    orderBySchedule: (req.query.orderBySchedule === "true") ? true : false,
                    showAllRoutesFirst: (req.query.showAllRoutesFirst === "true") ? true : false,
                });
            res.status(200).send(data.map((d: IDeparture) => this.transformResponseData(d, preferredTimezone)));
        } catch (err) {
            next(err);
        }
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private transformResponseData = (x: IDeparture, preferredTimezone: string): any => {
        return {
            arrival_timestamp: {
                // with added delay
                predicted: this.formatDatetime(x.arrival_datetime_real, preferredTimezone),
                // according to trip plan
                scheduled: this.formatDatetime(x.arrival_datetime, preferredTimezone),
            },
            delay: {
              is_available: x.is_delay_available,
              minutes: x.delay_minutes, // TBD - now it could be negative!
              seconds: x.delay_seconds, // TBD - now it could be negative!
            },
            departure_timestamp: {
                // with added delay
                predicted: this.formatDatetime(x.departure_datetime_real, preferredTimezone),
                // according to trip plan
                scheduled: this.formatDatetime(x.departure_datetime, preferredTimezone),
            },
            // last_stop: {
            //     id: null, // TBD
            //     name: null, // TBD
            // },
            route: {
                short_name: x.route_short_name,
                type: x.route_type, // nově typ dopravy metro/tram/...
            },
            stop: {
                id: x.stop_id,
                name: x.stop_name,
                platform_code: x.platform_code,
                wheelchair_boarding: x.wheelchair_boarding, // enum 0,1,2 see GTFS specs
            },
            trip: {
                headsign: x.trip_headsign,
                id: x.trip_id,
                is_canceled: x.is_canceled,
                is_wheelchair_accessible: x.wheelchair_accessible, // enum 0,1,2 see GTFS specs
            },
        };
    }

    /**
     * Formats datetime value to Zulu format or to preferred timezone by given query parameter
     */
    private formatDatetime = (datetime: string, preferredTimezone: string): string => {
        return preferredTimezone === "UTC" ? datetime : moment(datetime).tz(preferredTimezone).toISOString(true);
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.initDepartureBoardsEndpoints();
    }

    private initDepartureBoardsEndpoints = (expire?: number | string): void => {
        this.router.get("/",
            [
                oneOf([
                    query("ids").exists().isArray(),
                    query("aswIds").exists().isArray(),
                    query("cisIds").exists().isArray(),
                    query("ids").exists().isString(),
                    query("aswIds").exists().isString(),
                    query("cisIds").exists().isString(),
                    query("names").exists().isArray(),
                    query("names").exists().isString(),
                ]),
                query("ids.*").optional().isString(),
                query("aswIds.*").optional().isString(),
                query("cisIds.*").optional().isInt(),
                query("names.*").optional().isString(),
                query("minutesBefore").optional().isInt(),
                query("minutesAfter").optional().isInt(),
                query("orderBySchedule").optional().isBoolean(),
                query("preferredTimezone").optional().isString(),
                query("showAllRoutesFirst").optional().isBoolean(),
            ],
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("DepartureBoardsRouter"),
            useCacheMiddleware(expire),
            this.GetDepartureBoard,
        );
    }
}

const departureBoardsRouter: Router = new DepartureBoardsRouter().router;

export { departureBoardsRouter };
