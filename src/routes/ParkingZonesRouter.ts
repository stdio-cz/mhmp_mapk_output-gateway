/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import { ParkingZonesModel } from "../models/ParkingZonesModel";
import { GeoJsonRouter } from "./GeoJsonRouter";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";

const log = require("debug")("data-platform:output-gateway");

export class ParkingZonesRouter extends GeoJsonRouter {

    constructor() {
        super(new ParkingZonesModel());
    }

}

export default new ParkingZonesRouter().router;
