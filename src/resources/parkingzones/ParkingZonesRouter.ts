/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { ParkingZonesModel } from ".";
import { useCacheMiddleware } from "../../core/redis";
import { GeoJsonRouter } from "../../core/routes";

export class ParkingZonesRouter extends GeoJsonRouter {

    protected model: ParkingZonesModel = new ParkingZonesModel();

    constructor() {
        super(new ParkingZonesModel());
        this.initRoutes();
        this.router.get(
            "/:id/tariffs",
            useCacheMiddleware(),
            this.GetTariffsByParkingZoneId,
        );
        this.router.get(
            "/tariffs",
            useCacheMiddleware(),
            this.GetAllTariffs,
        );
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.model.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetTariffsByParkingZoneId = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        this.model.GetTariffsByParkingZoneId(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetAllTariffs = (req: Request, res: Response, next: NextFunction) => {
        this.model.GetAllTariffs().then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

}

const parkingZonesRouter: Router = new ParkingZonesRouter().router;

export { parkingZonesRouter };
