/**
 * app/routers/SortedWasteRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import { CustomError } from "../../core/errors";
import { handleError } from "../../core/errors";
import { parseCoordinates } from "../../core/Geo";
import { GeoJsonRouter } from "../../core/routes";
import { checkErrors, pagination } from "../../core/Validation";
import { useCacheMiddleware } from "../../modules/redis";
import { SortedWasteMeasurementsModel } from "./SortedWasteMeasurementsModel";
import { SortedWastePicksModel } from "./SortedWastePicksModel";
import { SortedWasteStationsModel } from "./SortedWasteStationsModel";

export class SortedWasteRouter extends GeoJsonRouter {

    protected model: SortedWasteStationsModel = new SortedWasteStationsModel();
    protected measurementsModel: SortedWasteMeasurementsModel = new SortedWasteMeasurementsModel();
    protected picksModel: SortedWastePicksModel = new SortedWastePicksModel();

    constructor() {
        super(new SortedWasteStationsModel());
        this.initRoutes();
        this.router.get("/measurements", [
            query("containerId").optional().isNumeric(),
            query("from").optional().isISO8601(),
            query("to").optional().isISO8601(),
        ],
            pagination,
            checkErrors,
            useCacheMiddleware(),
            this.GetMeasurements,
        );
        this.router.get("/picks",
            [
                query("containerId").optional().isNumeric(),
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
            ],
            pagination,
            checkErrors,
            useCacheMiddleware(),
            this.GetPicks,
        );
        this.router.get("/",
            [
                query("accessibility").optional().isNumeric(),
                query("onlyMonitored").optional().isBoolean(),
            ],
            pagination,
            checkErrors,
            useCacheMiddleware(),
            this.GetAll,
        );
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        let ids: number[] = req.query.ids;
        let districts: string[] = req.query.districts;
        const accessibilityFilter = req.query.accessibility;
        const onlyMonitoredFilter = req.query.onlyMonitored;
        let additionalFilters = {};

        if (districts) {
            districts = this.ConvertToArray(districts);
        }
        if (ids) {
            ids = this.ConvertToArray(ids);
        }
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            if (accessibilityFilter) {
                additionalFilters = {
                    ...additionalFilters,
                    ...{ "properties.accessibility.id": req.query.accessibility },
                };
            }
            if (onlyMonitoredFilter === "true") {
                additionalFilters = {
                    ...additionalFilters,
                    ...{ "properties.containers": { $elemMatch: { sensor_id: { $exists: true } } } },
                };
            }
            const data = await this.model.GetAll({
                additionalFilters,
                districts,
                ids,
                lat: coords.lat,
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                range: coords.range,
                updatedSince: req.query.updatedSince,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetMeasurements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.measurementsModel.GetAll(
                req.query.containerId,
                req.query.limit,
                req.query.offset,
                req.query.from,
                req.query.to,
            );
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetPicks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.picksModel.GetAll(
                req.query.containerId,
                req.query.limit,
                req.query.offset,
                req.query.from,
                req.query.to,
            );
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

const sortedWasteRouter = new SortedWasteRouter().router;

export { sortedWasteRouter };
