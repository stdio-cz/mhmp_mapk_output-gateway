/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { CustomError } from "../../core/errors";
import { handleError } from "../../core/errors";
import { GeoJsonRouter } from "../../core/routes";
import { useCacheMiddleware } from "../../modules/redis";
import { ParkingZonesModel } from "./ParkingZonesModel";

export class ParkingZonesRouter extends GeoJsonRouter {

    protected model: ParkingZonesModel = new ParkingZonesModel();

    constructor() {
        super(new ParkingZonesModel());
        this.initRoutes();
        this.router.get(
            "/:id/tariffs",
            useCacheMiddleware(),
            this.GetTariffs,
        );
    }

    public GetTariffs = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        this.model.GetTariffs(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

}

const parkingZonesRouter = new ParkingZonesRouter().router;

export { parkingZonesRouter };
