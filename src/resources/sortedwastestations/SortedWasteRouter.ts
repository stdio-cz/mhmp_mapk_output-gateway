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
import { SortedWasteMeasurementsModel } from "./SortedWasteMeasurementsModel";
import { SortedWasteStationsModel } from "./SortedWasteStationsModel";

export class SortedWasteRouter extends GeoJsonRouter {

    protected model: SortedWasteStationsModel = new SortedWasteStationsModel();
    protected measurementsModel: SortedWasteMeasurementsModel = new SortedWasteMeasurementsModel();

    constructor() {
        super(new SortedWasteStationsModel());
        this.router.get("/measurements", this.GetMeasurements);
        this.initRoutes();
        this.router.get("/", [
            query("accessibility").optional().isNumeric(),
            query("onlyMonitored").optional().isBoolean(),
        ], this.GetAll);
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
            const data = await this.measurementsModel.GetAll();
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

const sortedWasteRouter = new SortedWasteRouter().router;

export { sortedWasteRouter };
