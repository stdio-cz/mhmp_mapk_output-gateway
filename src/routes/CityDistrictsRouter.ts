/**
 * app/routers/CityDistrictsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";
import log from "../helpers/Logger";
import { CityDistrictsModel } from "../models/CityDistrictsModel";
import { GeoJsonRouter } from "./GeoJsonRouter";

export class CityDistrictsRouter extends GeoJsonRouter {

    constructor() {
        super(new CityDistrictsModel());
        this.initRoutes();
    }

}

export default new CityDistrictsRouter().router;
