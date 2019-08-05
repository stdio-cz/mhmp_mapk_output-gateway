/**
 * GardensRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { GardensModel } from ".";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";

export class GardensRouter extends GeoJsonRouter {

    constructor() {
        super(new GardensModel());
        this.initRoutes();
        this.router.get("/properties",
            useCacheMiddleware(),
            this.GetProperties,
        );
    }

    public GetProperties = (req: Request, res: Response, next: NextFunction) => {
        this.model.GetProperties().then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

}

const gardensRouter: Router = new GardensRouter().router;

export { gardensRouter };
