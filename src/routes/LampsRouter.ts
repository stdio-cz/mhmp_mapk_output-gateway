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

const log = require("debug")("data-platform:output-gateway");

export class LampsRouter extends GeoJsonRouter {

    public model = new LampsModel();
    // Assign router to the express.Router() instance
    public router: Router = Router();

    constructor() {
        super();
        this.initRoutes();
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.router.get("/", this.GetAll);
        this.router.get("/:id", this.GetOne);
    }

    private GetOne = (req: Request, res: Response, next: NextFunction) => {
        const code: String = req.params.id;

        this.model.GetOne(code).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }
}

export default new LampsRouter().router;
