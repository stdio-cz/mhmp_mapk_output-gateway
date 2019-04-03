/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { NextFunction, Request, Response, Router } from "express";
import { CustomError } from "../errors";
import { handleError } from "../errors";
import { parseCoordinates } from "../Geo";
import { log } from "../Logger";
import {GeoJsonModel} from "../models/GeoJsonModel";

export class GeoJsonRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: GeoJsonModel;

    public constructor(inModel: GeoJsonModel) {
        this.model = inModel;
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    public initRoutes = (): void => {
        this.router.get("/", this.GetAll);
        this.router.get("/:id", this.GetOne);
    }

    public ConvertToArray = (toBeArray: any) => {
        if (!(toBeArray instanceof Array)) {
            log.silly("Converting value `" + toBeArray + "` to array.");
            const val = toBeArray;
            toBeArray = [];
            toBeArray.push(val);
        }
        return toBeArray;
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        const limit: number = parseInt(req.query.limit, 10);
        const offset: number = parseInt(req.query.offset, 10);
        const updatedSince: number = parseInt(req.query.updated_since, 10);
        let ids: number[] = req.query.ids;
        let districts: string[] = req.query.districts;

        if (districts) {
            districts = this.ConvertToArray(districts);
        }

        if (ids) {
            ids = this.ConvertToArray(ids);
        }
        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);
            const data = await this.model.GetAll({
                districts,
                ids,
                lat: coords.lat,
                limit,
                lng: coords.lng,
                offset,
                range: coords.range,
                updatedSince,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOne = (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;

        this.model.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }
}
