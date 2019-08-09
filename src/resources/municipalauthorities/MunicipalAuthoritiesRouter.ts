/**
 * app/routers/MunicipalAuthoritiesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import { parseCoordinates } from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";
import { MunicipalAuthoritiesModel, MunicipalAuthoritiesQueuesModel } from "./models";

export class MunicipalAuthoritiesRouter extends GeoJsonRouter {

    protected model: MunicipalAuthoritiesModel = new MunicipalAuthoritiesModel();
    protected queuesModel: MunicipalAuthoritiesQueuesModel = new MunicipalAuthoritiesQueuesModel();

    constructor() {
        super(new MunicipalAuthoritiesModel());
        this.initRoutes();
        this.router.get("/:id/queues", [
            param("id").exists().isString(),
        ],
            useCacheMiddleware(),
            this.GetQueues,
        );
        this.router.get("/", [
            query("type").optional().isString(),
        ],
            useCacheMiddleware(),
            this.GetAll,
        );
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        let ids: number[] = req.query.ids;
        let districts: string[] = req.query.districts;
        const typeFilter = req.query.type;
        let additionalFilters = {};

        if (districts) {
            districts = this.ConvertToArray(districts);
        }
        if (ids) {
            ids = this.ConvertToArray(ids);
        }
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            if (typeFilter) {
                additionalFilters = {
                    ...additionalFilters,
                    ...{ "properties.type.id": req.query.type },
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

    public GetQueues = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.queuesModel.GetQueuesByOfficeId(req.params.id);
            if (!data) {
                return res.status(204).send();
            } else {
                return res.status(200).send(data);
            }
        } catch (err) {
            next(err);
        }
    }
}

const municipalAuthoritiesRouter: Router = new MunicipalAuthoritiesRouter().router;

export { municipalAuthoritiesRouter };
