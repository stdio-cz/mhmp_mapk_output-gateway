/**
 * app/routers/LampsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import { LampsModel } from "../models/LampsModel";
import { GeoJsonRouter } from "./GeoJsonRouter";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";

export class LampsRouter extends GeoJsonRouter {

    constructor() {
        super(new LampsModel());
    }

}

export default new LampsRouter().router;
