/**
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import {
    buildGeojsonFeatureCollection,
    parseCoordinates,
} from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import { BaseRouter } from "../../core/routes/BaseRouter";
import { checkErrors, pagination } from "../../core/Validation";

import { IGeoJSONFeatureCollection } from "../../core/Geo";

import { ILocation, ILocationNormalized, models } from "./models";

import { IDetection } from "./models";

import { NextFunction, Request, Response, Router } from "express";

import { query } from "express-validator/check";

import { BicycleCountersDetectionsModel } from "./models/BicycleCountersDetectionsModel";
import { BicycleCountersLocationsModel } from "./models/BicycleCountersLocationsModel";
import { BicycleCountersTemperaturesModel } from "./models/BicycleCountersTemperaturesModel";

export class BicycleCountersRouter extends BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected BicycleCountersLocationsModel: BicycleCountersLocationsModel;
    protected BicycleCountersDetectionsModel: BicycleCountersDetectionsModel;
    protected BicycleCountersTemperaturesModel: BicycleCountersTemperaturesModel;

    public constructor() {
        super();
        this.BicycleCountersLocationsModel = models.BicycleCountersLocationsModel;
        this.BicycleCountersDetectionsModel = models.BicycleCountersDetectionsModel;
        this.BicycleCountersTemperaturesModel = models.BicycleCountersTemperaturesModel;
        this.initRoutes();
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            const data = await this.BicycleCountersLocationsModel
                .GetAll({
                    lat: coords.lat,
                    limit: req.query.limit || null,
                    lng: coords.lng,
                    offset: req.query.offset || 0,
                    range: coords.range,
                });

            res.status(200).send(this.NormalizeLocations(await this.CheckBeforeSendingData(data)));
        } catch (err) {
            next(err);
        }

    }

    /**
     * get method for get BicycleCountersDetections or BicycleCountersTemperatures depending on given model
     */
    public GetData = (model: BicycleCountersDetectionsModel | BicycleCountersTemperaturesModel) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                // to make it a bit foolproof
                const isoDateTo: any = req.query.to ? (new Date(req.query.to)) : null;
                // imho we should limit date range
                const isoDateFrom = req.query.from ? (new Date(req.query.from)) : null;

                const data = await model
                    .GetAll({
                        aggregate: req.query.aggregate || null,
                        id: this.ConvertToArray(req.query.id || []),
                        isoDateFrom,
                        isoDateTo,
                        limit: req.query.limit || null,
                        offset: req.query.offset || 0,
                    });

                data.forEach((element: IDetection) => {
                    if (req.query.aggregate) {
                        element.measured_from = (isoDateFrom || new Date("1970-01-01")).toISOString();
                        element.measured_to = (isoDateTo || new Date()).toISOString();
                        element.value = Math.round((element.value) * 100) / 100;
                    } else {
                        element.measured_from = (new Date(parseInt(element.measured_from, 10))).toISOString();
                        element.measured_to = (new Date(parseInt(element.measured_to, 10))).toISOString();
                    }
                });

                res.status(200).send(await this.CheckBeforeSendingData(data));
            } catch (err) {
                next(err);
            }
        };
    }

    /**
     * transforms raw DB output ILocation[] to desired IGeoJSONFeatureCollection
     * API output by grouping  directions by locations
     */
    private NormalizeLocations = (locations: ILocation[]): IGeoJSONFeatureCollection => {
        const normalizedData: ILocationNormalized[] = [];
        const indexes: { [key: string]: number } = {};
        locations.forEach((location: ILocation) => {
            if (indexes[location.id] !== undefined) {
                normalizedData[indexes[location.id]].directions.push({
                    id: location["directions.id"],
                    name: location["directions.name"],
                });
            } else {
                indexes[location.id] = normalizedData.length;
                normalizedData.push({
                    directions: [{
                        id: location["directions.id"],
                        name: location["directions.name"],
                    }],
                    id: location.id,
                    lat: location.lat,
                    lng: location.lng,
                    name: location.name,
                    route: location.route,
                    updated_at: location.updated_at,
                });
            }
        });
        return buildGeojsonFeatureCollection(
            normalizedData,
            "lng",
            "lat",
            true,
        );
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     * @param {number|string} expire TTL for the caching middleware
     */
    private initRoutes = (expire?: number | string): void => {
        this.router.get("/temperatures",
            [
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
                query("id").optional(),
                query("aggregate").optional().isBoolean(),
            ],
            pagination,
            checkErrors,
            this.CheckPaginationLimitMiddleware("BicycleCountersRouter"),
            useCacheMiddleware(expire),
            this.GetData(this.BicycleCountersTemperaturesModel),
        );

        this.router.get("/detections",
            [
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
                query("id").optional(),
                query("aggregate").optional().isBoolean(),
            ],
            pagination,
            checkErrors,
            this.CheckPaginationLimitMiddleware("BicycleCountersRouter"),
            useCacheMiddleware(expire),
            this.GetData(this.BicycleCountersDetectionsModel),
        );

        this.router.get("/",
            [
                query("latlng").optional().isLatLong(),
                query("range").optional().isNumeric(),
            ],
            pagination,
            checkErrors,
            this.CheckPaginationLimitMiddleware("BicycleCountersRouter"),
            useCacheMiddleware(expire),
            this.GetAll,
        );
    }
}

const bicycleCountersRouter: Router = new BicycleCountersRouter().router;

export { bicycleCountersRouter };
