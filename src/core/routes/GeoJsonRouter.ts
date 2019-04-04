import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import { CustomError } from "../errors";
import { handleError } from "../errors";
import { parseCoordinates } from "../Geo";
import { log } from "../Logger";
import { GeoJsonModel } from "../models/GeoJsonModel";
import { checkErrors, pagination } from "../Validation";

/**
 * Router for data in GeoJSON format using GeoJSON model -
 * binds / and /:id to GetAll and GetOne methods of GeoJsonModel.
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */
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
        this.router.get("/", [
            query("updatedSince").optional().isNumeric(),
            query("districts"),
            query("districts.*").isString(),
        ], pagination, checkErrors, this.GetAll);
        this.router.get("/:id", [
            param("id").exists(),
        ], checkErrors, this.GetOne);
    }

    /**
     * Converts a single value of `any` type to an array containing this element
     */
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
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                range: coords.range,
                updatedSince: req.query.updatedSince,
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
