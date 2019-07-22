/**
 * app/routers/GTFSRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import moment = require("moment");
import { CustomError } from "../../core/errors";
import { parseCoordinates } from "../../core/Geo";
import { log } from "../../core/Logger";
import { useCacheMiddleware } from "../../core/redis";
import { checkErrors, pagination } from "../../core/Validation";
import { models } from "./models";
import { GTFSCalendarModel } from "./models/GTFSCalendarModel";
import { GTFSRoutesModel } from "./models/GTFSRoutesModel";
import { GTFSShapesModel } from "./models/GTFSShapesModel";
import { GTFSStopModel } from "./models/GTFSStopModel";
import { GTFSStopTimesModel } from "./models/GTFSStopTimesModel";
import { GTFSTripsModel } from "./models/GTFSTripsModel";

export class GTFSRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected tripModel: GTFSTripsModel;
    protected serviceModel: GTFSCalendarModel;
    protected stopModel: GTFSStopModel;
    protected routeModel: GTFSRoutesModel;
    protected shapeModel: GTFSShapesModel;
    protected stopTimeModel: GTFSStopTimesModel;

    // Reg-ex to match a valid daytime format (ex. 21:43:56)
    private timeRegex = /(([0-1][0-9])|(2[0-3])):[0-5][0-9]:[0-5][0-9]/;

    private tripInclusions = [
        query("includeShapes").optional().isBoolean(),
        query("includeStops").optional().isBoolean(),
        query("includeStopTimes").optional().isBoolean(),
        query("includeService").optional().isBoolean(),
        query("includeRoute").optional().isBoolean(),
        query("date").optional().isISO8601(),
    ];

    private stopTimesHandlers = [
        param("stopId").exists(),
        query("from").optional().matches(this.timeRegex),
        query("to").optional().matches(this.timeRegex),
        query("date").optional().isISO8601(),
        query("includeStop").optional().isBoolean(),
    ];

    public constructor() {
        this.tripModel = models.GTFSTripsModel;
        this.stopModel = models.GTFSStopModel;
        this.stopTimeModel = models.GTFSStopTimesModel;
        this.routeModel = models.GTFSRoutesModel;
        this.shapeModel = models.GTFSShapesModel;
        this.serviceModel = models.GTFSCalendarModel;
        this.initRoutes();
    }

    public GetAllServices = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.serviceModel
                .GetAll({
                    date: req.query.date || null,
                    limit: req.query.limit,
                    offset: req.query.offset,
                });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetAllStopTimes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.stopTimeModel
                .GetAll({
                    date: req.query.date || null,
                    from: req.query.from || null,
                    limit: req.query.limit,
                    offset: req.query.offset,
                    stop: req.query.includeStop || false,
                    stopId: req.params.stopId,
                    to: req.query.to || null,
                });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetAllTrips = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.tripModel
                .GetAll({
                    date: req.query.date || false,
                    limit: req.query.limit,
                    offset: req.query.offset,
                    stopId: req.query.stopId,
                });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOneTrip = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const data = await this.tripModel
                .GetOne(id, {
                    date: req.query.date || false,
                    route: req.query.includeRoute || false,
                    service: req.query.includeService || false,
                    shapes: req.query.includeShapes || false,
                    stopTimes: req.query.includeStopTimes || false,
                    stops: req.query.includeStops || false,
                });

            if (!data) {
                throw new CustomError("not_found", true, 404, null);
            }
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetAllStops = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            const data = await this.stopModel.GetAll({
                lat: coords.lat,
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                range: coords.range,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOneStop = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const data = await this.stopModel.GetOne(id);
            if (!data) {
                throw new CustomError("not_found", true, 404, null);
            }
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetAllRoutes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.routeModel
                .GetAll({
                    limit: req.query.limit,
                    offset: req.query.offset,
                });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOneRoute = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id: string = req.params.id;
            const data = await this.routeModel.GetOne(id);
            if (!data) {
                throw new CustomError("not_found", true, 404, null);
            }
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetAllShapes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.shapeModel
                .GetAll({
                    id: req.params.id,
                    limit: req.query.limit,
                    offset: req.query.offset,
                });
            if (!data) {
                throw new CustomError("not_found", true, 404, null);
            }
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.initTripsEndpoints();
        this.initStopsEndpoints();
        this.initStopTimesEndpoints();
        this.initRoutesEndpoints();
        this.initShapesEndpoints();
        this.initServicesEndpoints();
    }

    private initRoutesEndpoints = (expire?: number | string): void => {
        this.router.get("/routes",
            pagination,
            checkErrors,
            useCacheMiddleware(expire),
            this.GetAllRoutes,
        );
        this.router.get("/routes/:id",
            param("id").exists(),
            useCacheMiddleware(expire),
            this.GetOneRoute,
        );
    }

    private initServicesEndpoints = (expire?: number | string): void => {
        this.router.get("/services",
            query("date").optional().isISO8601(),
            pagination,
            checkErrors,
            useCacheMiddleware(expire),
            this.GetAllServices,
        );
    }

    private initShapesEndpoints = (expire?: number | string): void => {
        this.router.get("/shapes/:id",
            pagination,
            checkErrors,
            param("id").exists(),
            useCacheMiddleware(expire),
            this.GetAllShapes,
        );
    }

    private initTripsEndpoints = (expire?: number | string): void => {
        this.router.get("/trips",
            query("stopId").optional(),
            this.tripInclusions,
            pagination,
            checkErrors,
            useCacheMiddleware(expire),
            this.GetAllTrips,
        );
        this.router.get("/trips/:id",
            param("id").exists(),
            this.tripInclusions,
            checkErrors,
            useCacheMiddleware(expire),
            this.GetOneTrip,
        );
    }

    private initStopsEndpoints = (expire?: number | string): void => {
        this.router.get("/stops",
            [
                query("latlng").optional().isLatLong(),
                query("range").optional().isNumeric(),
            ],
            pagination,
            checkErrors,
            useCacheMiddleware(expire),
            this.GetAllStops);
        this.router.get("/stops/:id",
            [param("id").exists()],
            checkErrors,
            useCacheMiddleware(expire),
            this.GetOneStop);
    }

    private initStopTimesEndpoints = (expire?: number | string): void => {
        this.router.get(
            "/stoptimes/:stopId",
            this.stopTimesHandlers,
            pagination,
            checkErrors,
            (req: Request, res: Response, next: NextFunction) => {
                if (req.query.from &&
                    req.query.to &&
                    moment(req.query.from, "H:mm:ss").isAfter(moment(req.query.to, "H:mm:ss"))
                ) {
                    throw new CustomError("Validation error", true, 400, { from: "'to' cannot be later than 'from'" });
                }
                return next();
            },
            useCacheMiddleware(expire),
            this.GetAllStopTimes,
        );
    }
}

const gtfsRouter: Router = new GTFSRouter().router;

export { gtfsRouter };
