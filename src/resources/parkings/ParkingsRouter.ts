/**
 * ParkingsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { CustomError } from "../../core/errors";
import { handleError } from "../../core/errors";
import { log } from "../../core/Logger";
import { GeoJsonRouter } from "../../core/routes";
import { ParkingsModel } from "./ParkingsModel";

export class ParkingsRouter extends GeoJsonRouter {

    constructor() {
        super(new ParkingsModel());
        this.GetOne.bind(this);
        this.initRoutes();
    }

    public GetOne = (req: Request, res: Response, next: NextFunction) => {
        const id = +req.params.id;
        if (isNaN(id)) {
            next(new CustomError("Bad request - wrong input parameters", true, 400));
            return;
        }
        this.model.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }
}

const parkingsRouter = new ParkingsRouter().router;

export { parkingsRouter };
