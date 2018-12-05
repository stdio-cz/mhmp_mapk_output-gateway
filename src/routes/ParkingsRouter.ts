/**
 * app/routers/ParkingsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import { ParkingsModel } from "../models/ParkingsModel";
import { GeoJsonRouter } from "./GeoJsonRouter";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";

const log = require("debug")("data-platform:output-gateway");

export class ParkingsRouter extends GeoJsonRouter {

    constructor() {
        super(new ParkingsModel());
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

export default new ParkingsRouter().router;
