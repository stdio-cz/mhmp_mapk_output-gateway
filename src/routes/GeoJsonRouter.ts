/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import { GeoJsonModel } from "../models/GeoJsonModel";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";

export abstract class GeoJsonRouter {
    protected abstract model: GeoJsonModel;

    public constructor(){
    }

    public GetAll = (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        const limit: number = parseInt(req.query.limit, 10);
        const offset: number = parseInt(req.query.offset, 10);
        const updatedSince: number = parseInt(req.query.updated_since, 10);
        if (req.query.latlng) { // Searching by coordinates
            const [latStr, lngStr] = req.query.latlng.split(",");
            const lat: number = +latStr;
            const lng: number = +lngStr;
            let range: number|undefined = parseInt(req.query.range, 10);
            if (isNaN(range)) {
                range = undefined;
            }
            if (isNaN(lat) || isNaN(lng)) {
                next(new CustomError("Bad request - wrong input parameters", true, 400));
                return;
            }
            this.model.GetByCoordinates(lat, lng, range, limit, offset, updatedSince).then((data) => {
                res.status(200)
                    .send(data);
            }).catch((err) => {
                next(err);
            });
            return;
        } else { // Not searching by coordinates
            this.model.GetAll(limit, offset, updatedSince).then((data) => {
                res.status(200)
                    .send(data);
            }).catch((err) => {
                next(err);
            });
        }
    }
}