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
import log from "../helpers/Logger";

export class GeoJsonRouter {
    protected model: GeoJsonModel;
    
    // Assign router to the express.Router() instance
    public router: Router = Router();

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    public initRoutes = (): void => {
        this.router.get("/", this.GetAll);
        this.router.get("/:id", this.GetOne);
    }

    public constructor(inModel: GeoJsonModel){
        this.model = inModel;
    }

    public ConvertToArray = (toBeArray: any) => {
        if (! (toBeArray instanceof Array) ){
            log.silly("Converting value `" + toBeArray + "` to array.")
            let val = toBeArray;
            toBeArray = [];
            toBeArray.push(val);
        }
        return toBeArray;
    }

    public GetAll = (req: Request, res: Response, next: NextFunction) => {
        // Parsing parameters
        const limit: number = parseInt(req.query.limit, 10);
        const offset: number = parseInt(req.query.offset, 10);
        const updatedSince: number = parseInt(req.query.updated_since, 10);
        let ids: number[] = req.query.ids;
        let districts: string[] = req.query.districts;


        if (districts){
            districts = this.ConvertToArray(districts);
        }

        if (ids){
            ids = this.ConvertToArray(ids);
        }

        let lat: number|undefined = undefined;
        let lng: number|undefined = undefined;
        let range: number|undefined = undefined;

        // Searching by coordinates
        if (req.query.latlng) { 
            const [latStr, lngStr] = req.query.latlng.split(",");
            lat = +latStr;
            lng = +lngStr;
            range = parseInt(req.query.range, 10);
            if (isNaN(range)) {
                range = undefined;
            }
            if (isNaN(lat) || isNaN(lng)) {
                log.silly("Wrong input parameter lat: `" + lat + "` or lng: `" + lng + "`");
                next(new CustomError("Bad request - wrong input parameters", true, 400));
                return;
            }
        }

        this.model.GetAll(lat, lng, range, limit, offset, updatedSince, districts, ids).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
        return;
    }

    public GetOne = (req: Request, res: Response, next: NextFunction) => {
        const id: String = req.params.id;

        this.model.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }
}