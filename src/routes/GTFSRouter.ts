/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import {NextFunction, Request, Response, Router} from "express";
import {param, query} from "express-validator/check";
import moment = require("moment");
import {parseCoordinates} from "../helpers/Coordinates";
import CustomError from "../helpers/errors/CustomError";
import {checkErrors, pagination} from "../helpers/Validation";
import {models} from "../models";
import {GTFSCalendarModel} from "../models/GTFSCalendarModel";
import {GTFSRoutesModel} from "../models/GTFSRoutesModel";
import {GTFSShapesModel} from "../models/GTFSShapesModel";
import {GTFSStopModel} from "../models/GTFSStopModel";
import {GTFSStopTimesModel} from "../models/GTFSStopTimesModel";
import {GTFSTripsModel} from "../models/GTFSTripsModel";

export class GTFSRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected tripModel: GTFSTripsModel;
    protected serviceModel: GTFSCalendarModel;
    protected stopModel: GTFSStopModel;
    protected routeModel: GTFSRoutesModel;
    protected shapeModel: GTFSShapesModel;
    protected stopTimeModel: GTFSStopTimesModel;

    private timeRegex = /([0-1][0-9])|(2[0-3]):[0-5][0-9]:[0-5][0-9]/;

    private tripInclusions = [
        query("include_shapes").optional().isBoolean(),
        query("include_stops").optional().isBoolean(),
        query("include_stop_times").optional().isBoolean(),
        query("include_service").optional().isBoolean(),
        query("include_route").optional().isBoolean(),
        query("date").optional().isISO8601(),
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

    public GetAllServices = (req: Request, res: Response, next: NextFunction) => {
        this.serviceModel
            .GetAll({
                date: req.query.date || null,
                limit: req.query.limit,
                offset: req.query.offset,
            })
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetAllStopTimes = (req: Request, res: Response, next: NextFunction) => {
        this.stopTimeModel
            .GetAll(req.params.stopId, {
                date: req.query.date || null,
                from: req.query.from || null,
                limit: req.query.limit,
                offset: req.query.offset,
                to: req.query.to || null,
            })
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetAllTrips = (req: Request, res: Response, next: NextFunction) => {
        this.tripModel
            .GetAll({
                date: req.query.date || false,
                limit: req.query.limit,
                offset: req.query.offset,
                route: req.query.iclude_route || false,
                service: req.query.include_service || false,
                shapes: req.query.include_shapes || false,
                stopId: req.query.stop_id,
                stopTimes: req.query.include_stop_times || false,
                stops: req.query.include_stops || false,
            })
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetOneTrip = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.tripModel
            .GetOne(id, {
                date: req.query.date || false,
                route: req.query.iclude_route || false,
                service: req.query.include_service || false,
                shapes: req.query.include_shapes || false,
                stopTimes: req.query.include_stop_times || false,
                stops: req.query.include_stops || false,
            })
            .then((data) => {
                if (!data) {
                    throw new CustomError("not_found", true, 404, null);
                }
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetAllStops = (req: Request, res: Response, next: NextFunction) => {
        parseCoordinates(req.query.latlng, req.query.range)
            .then(({lat, lng, range}) =>
                this.stopModel
                    .GetAll({
                        lat,
                        limit: req.query.limit,
                        lng,
                        offset: req.query.offset,
                        range,
                    }),
            )
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetOneStop = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.stopModel
            .GetOne(id)
            .then((data) => {
                if (!data) {
                    throw new CustomError("not_found", true, 404, null);
                }
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetAllRoutes = (req: Request, res: Response, next: NextFunction) => {
        this.routeModel
            .GetAll({
                limit: req.query.limit,
                offset: req.query.offset,
            })
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetOneRoute = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.routeModel
            .GetOne(id)
            .then((data) => {
                if (!data) {
                    throw new CustomError("not_found", true, 404, null);
                }
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetAllShapes = (req: Request, res: Response, next: NextFunction) => {
        this.shapeModel
            .GetAll({
                limit: req.query.limit,
                offset: req.query.offset,
            })
            .then((data) => {
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
    }

    public GetOneShape = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.shapeModel
            .GetOne(id)
            .then((data) => {
                if (!data) {
                    throw new CustomError("not_found", true, 404, null);
                }
                res.status(200).send(data);
            })
            .catch((err) => {
                next(err);
            });
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

    private initRoutesEndpoints = (): void => {
        this.router.get("/routes",
            pagination,
            checkErrors,
            this.GetAllRoutes,
        );
        this.router.get("/routes/:id", param("id").exists(), this.GetOneRoute);
    }

    private initServicesEndpoints = (): void => {
        this.router.get("/services",
            query("date").optional().isISO8601(),
            pagination,
            checkErrors,
            this.GetAllServices,
        );
    }

    private initShapesEndpoints = (): void => {
        this.router.get("/shapes",
            pagination,
            checkErrors,
            this.GetAllShapes,
        );
        this.router.get("/shapes/:id", param("id").exists(), this.GetOneShape);
    }

    private initTripsEndpoints = (): void => {
        this.router.get("/trips",
            query("stop_id").optional(),
            this.tripInclusions,
            pagination,
            checkErrors,
            this.GetAllTrips,
        );
        this.router.get("/trips/:id", param("id").exists(), this.tripInclusions, checkErrors, this.GetOneTrip);
    }

    private initStopsEndpoints = (): void => {
        this.router.get("/stops", [
            query("latlng").optional().isLatLong(),
        ], pagination, checkErrors, this.GetAllStops);
        this.router.get("/stops/:id", [param("id").exists()], checkErrors, this.GetOneStop);
    }

    private initStopTimesEndpoints = (): void => {
        this.router.get(
            "/stop_times/:stopId",
            [
                param("stopId").exists(),
                query("from").optional().matches(this.timeRegex),
                query("to").optional().matches(this.timeRegex),
                query("date").optional().isISO8601(),
            ],
            pagination,
            checkErrors,
            (req: any, res: any, next: any) => {
                if (req.query.from &&
                    req.query.to &&
                    moment(req.query.from, "H:mm:ss").isAfter(moment(req.query.to, "H:mm:ss"))
                ) {
                    throw new CustomError("Validation error", true, 400, {from: "'to' cannot be later than 'from'"});
                }
                return next();
            },
            this.GetAllStopTimes,
        );
    }
}

export default new GTFSRouter().router;
