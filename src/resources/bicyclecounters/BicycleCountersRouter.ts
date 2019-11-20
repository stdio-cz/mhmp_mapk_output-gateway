/**
 * app/routers/BicycleCountersRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { BicycleCountersModel } from ".";
import { parseCoordinates } from "../../core/Geo";
import { GeoJsonRouter } from "../../core/routes";

export class BicycleCountersRouter extends GeoJsonRouter {

    protected model: BicycleCountersModel = new BicycleCountersModel();

    constructor() {
        super(new BicycleCountersModel());
        this.initRoutes();
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        let ids = req.query.ids;
        if (ids) {
            ids = this.ConvertToArray(ids);
        }

        const timePeriod = req.query.timeperiod;

        const coords = await parseCoordinates(req.query.latlng, req.query.range);

        this.model.GetAll({
            ids,
            lat: coords.lat,
            lng: coords.lng,
            range: coords.range,
            timePeriod,
        }).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        next();
        // const id: string = req.params.id;

        // this.model.GetOne(id).then((data) => {
        //     res.status(200)
        //         .send(data);
        // }).catch((err) => {
        //     next(err);
        // });
    }
}

const bicycleCountersRouter: Router = new BicycleCountersRouter().router;

export { bicycleCountersRouter };
