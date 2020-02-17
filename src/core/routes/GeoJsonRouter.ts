import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { param, query, ValidationChain } from "express-validator/check";
import { Schema } from "mongoose";
import config from "../../config/config";
import { parseCoordinates } from "../Geo";
import { log } from "../Logger";
import { GeoJsonModel } from "../models/GeoJsonModel";
import { useCacheMiddleware } from "../redis";
import { checkErrors, pagination } from "../Validation";
import { BaseRouter } from "./BaseRouter";

/**
 * Router for data in GeoJSON format using GeoJSON model -
 * binds / and /:id to GetAll and GetOne methods of GeoJsonModel.
 *
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */
export class GeoJsonRouter extends BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: GeoJsonModel;

    protected standardParams = [
        query("updatedSince").optional().isISO8601(),
        query("districts").optional(),
        query("districts.*").isString(),
        query("ids").optional(),
        query("latlng").optional().isString(),
        query("range").optional().isNumeric(),
    ];

    public constructor(inModel: GeoJsonModel) {
        super();
        this.model = inModel;
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     * @param {number|string} expire TTL for the caching middleware
     */
    public initRoutes = async (expire?: number | string) => {
        const idParam = await this.GetIdQueryParamWithCorrectType();
        this.router.get("/",
            useCacheMiddleware(expire),
            this.standardParams,
            pagination,
            checkErrors,
            this.GetAll);
        this.router.get("/:id",
            useCacheMiddleware(expire),
            [
                // Previously set parameter of type according to the data's primary ID type
                idParam,
            ], checkErrors, this.GetOne);
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
            let data = await this.model.GetAll({
                districts,
                ids,
                lat: coords.lat,
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                range: coords.range,
                updatedSince: req.query.updatedSince,
            });

            data = await this.CheckBeforeSendingData(data);
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

    /**
     * @override CheckBeforeSendingData
     * Performs a final check on the data before sending them to the client (response)
     * @param data data to be sent to response
     */
    protected async CheckBeforeSendingData(data: any) {
        if (data.features.length > config.pagination_max_limit) {
            throw new CustomError("Pagination limit error", true, "GeoJsonRouter", 413);
        }
        return data;
    }

    protected GetIdQueryParamWithCorrectType = async (): Promise<ValidationChain> => {
        let idParam: ValidationChain;
        return await this.model.GetSchema().then((schema) => {
            // Get the primary ID of the schema (the attribute name)
            const idKey = Object.keys(this.model.PrimaryIdentifierSelection("0"))[0];
            let message: string = "Created model " + this.model.GetName() + " has ID `"
                + idKey + "` of type ";
            if (schema.path(idKey) instanceof Schema.Types.Number) {
                message += "number.";
                // Create a url parameter for detail route with type number
                idParam = param("id").exists().isNumeric();
            } else {
                message += "string.";
                // Create a url parameter for detail route with type string
                idParam = param("id").exists().isString();
            }
            log.silly(message);
            return idParam;
        });
    }

}
