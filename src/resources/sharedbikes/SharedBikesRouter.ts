/**
 * app/routers/sharedBikesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { query } from "express-validator/check";
import { parseCoordinates } from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";
import {
    checkErrors,
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";
import { SharedBikesModel } from "./SharedBikesModel";

export class SharedBikesRouter extends GeoJsonRouter {
    protected model: SharedBikesModel = new SharedBikesModel();

    constructor() {
        super(new SharedBikesModel());
        this.initRoutes();
        this.router.get("/", [
            query("companyName").optional().isString(),
        ],
            this.standardParams,
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("SharedBikesRouter"),
            useCacheMiddleware(),
            this.GetAll,
        );
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        let ids: number[] = req.query.ids;
        const companyName = req.query.companyName;
        let additionalFilters = {};

        if (ids) {
            ids = this.ConvertToArray(ids);
        }
        try {
            const coords = await parseCoordinates(
                req.query.latlng,
                req.query.range,
            );
            if (companyName) {
                additionalFilters = {
                    ...additionalFilters,
                    ...{ "properties.company.name": companyName },
                };
            }

            let data = await this.model.GetAll({
                additionalFilters,
                ids,
                lat: coords.lat,
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                range: coords.range,
                updatedSince: req.query.updatedSince,
            });

            data = await this.CheckBeforeSendingData(data);

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

const sharedBikesRouter: Router = new SharedBikesRouter().router;

export { sharedBikesRouter };
