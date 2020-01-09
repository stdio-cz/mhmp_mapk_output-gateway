/**
 * app/routers/BicycleCountersRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { query } from "express-validator/check";
import config from "../../config/config";
import { parseCoordinates } from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";
import { checkErrors, pagination } from "../../core/Validation";
import { BicycleCountersMeasurementsModel, BicycleCountersModel } from "./models";

export class BicycleCountersRouter extends GeoJsonRouter {

    protected model: BicycleCountersModel = new BicycleCountersModel();
    protected measurementsModel: BicycleCountersMeasurementsModel = new BicycleCountersMeasurementsModel();

    constructor() {
        super(new BicycleCountersModel());
        this.initRoutes();
        this.router.get("/measurements", [
            query("counterId").optional(),
            query("counterId.*").optional().isString(),
            query("from").optional().isISO8601(),
            query("to").optional().isISO8601(),
        ],
            pagination,
            checkErrors,
            useCacheMiddleware(),
            this.GetMeasurements,
        );
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        let ids = req.query.ids;
        if (ids) {
            ids = this.ConvertToArray(ids);
        }

        const timePeriod = req.query.timePeriod;

        const coords = await parseCoordinates(req.query.latlng, req.query.range);

        this.model.GetAll({
            ids,
            lat: coords.lat,
            limit: req.query.limit,
            lng: coords.lng,
            offset: req.query.offset,
            range: coords.range,
            timePeriod,
        }).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetMeasurements = async (req: Request, res: Response, next: NextFunction) => {
        let counterIds = req.query.counterId;
        if (counterIds) {
            counterIds = this.ConvertToArray(counterIds);
        }

        try {
            const data = await this.measurementsModel.GetAll(
                req.query.counterId,
                req.query.limit,
                req.query.offset,
                req.query.from,
                req.query.to,
            );

            if (data.length > config.pagination_max_limit) {
                throw new CustomError("Pagination limit error", true, "SortedWasteRouter", 413);
            }

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        next();
    }
}

const bicycleCountersRouter: Router = new BicycleCountersRouter().router;

export { bicycleCountersRouter };
