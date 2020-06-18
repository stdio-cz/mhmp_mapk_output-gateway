/**
 * app/routers/DepartureBoardsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { oneOf, query } from "express-validator/check";
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

        try {
            const data = await this.departureBoardsModel
                .GetAll({
                    aswIds,
                    cisIds,
                    gtfsIds,
                    limit: req.query.limit,
                    minutesAfter: parseInt(req.query.minutesAfter || 60, 10),
                    minutesBefore: parseInt(req.query.minutesBefore || 10, 10),
                    offset: req.query.offset,
                    orderBySchedule: (req.query.orderBySchedule === "true") ? true : false,
                    showAllRoutesFirst: (req.query.showAllRoutesFirst === "true") ? true : false,
                });
            res.status(200).send(data.map((d: IDeparture) => this.transformResponseData(d)));
        } catch (err) {
            next(err);
        }
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private transformResponseData = (x: IDeparture): any => {
        return {
            arrival_timestamp: {
                predicted: x.arrival_datetime_real, // with added delay
                scheduled: x.arrival_datetime, // according to trip plan
            },
            delay: {
              is_available: x.is_delay_available,
              minutes: x.delay_minutes, // TBD - now it could be negative!
              seconds: x.delay_seconds, // TBD - now it could be negative!
            },
            departure_timestamp: {
                predicted: x.departure_datetime, // with added delay
                scheduled: x.departure_datetime, // according to trip plan
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
                ]),
                query("ids.*").optional().isString(),
                query("aswIds.*").optional().isString(),
                query("cisIds.*").optional().isInt(),
                query("minutesBefore").optional().isInt(),
                query("minutesAfter").optional().isInt(),
                query("orderBySchedule").optional().isBoolean(),
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
