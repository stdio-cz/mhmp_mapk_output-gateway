/**
 * app/routers/MedicalInstitutionsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { query } from "express-validator/check";
import { MedicalInstitutionsModel } from ".";
import { parseCoordinates } from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";
import {
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";

export class MedicalInstitutionsRouter extends GeoJsonRouter {

    protected model: MedicalInstitutionsModel = new MedicalInstitutionsModel();

    constructor() {
        super(new MedicalInstitutionsModel());
        this.router.get("/types", this.GetTypes);
        this.initRoutes();
        this.router.get("/", [
            query("group").optional().isString(),
        ],
            this.standardParams,
            pagination,
            checkPaginationLimitMiddleware("MedicalInstitutionsModel"),
            useCacheMiddleware(),
            this.GetAll,
        );
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        let ids: number[] = req.query.ids;
        let districts: string[] = req.query.districts;
        const groupFilter = req.query.group;
        let additionalFilters = {};

        if (districts) {
            districts = this.ConvertToArray(districts);
        }
        if (ids) {
            ids = this.ConvertToArray(ids);
        }
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            if (groupFilter) {
                additionalFilters = {
                    ...additionalFilters,
                    ...{ "properties.type.group": groupFilter },
                };
            }
            let data = await this.model.GetAll({
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
            data = await this.CheckBeforeSendingData(data);
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetTypes = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.model.GetTypes();
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

const medicalInstitutionsRouter: Router = new MedicalInstitutionsRouter().router;

export { medicalInstitutionsRouter };
