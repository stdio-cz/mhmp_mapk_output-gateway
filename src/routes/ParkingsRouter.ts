/**
 * app/routers/ParkingsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { Request, Response, Router } from "express";
import { ParkingsController } from "../controllers/";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";

const log = require("debug")("data-platform:output-gateway");

export class ParkingsRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();
    private controller: ParkingsController = new ParkingsController();

    constructor() {
        this.initRoutes();
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.router.get("/", (req: Request, res: Response, next) => {
            const limit: number = parseInt(req.query.limit, 10);
            const offset: number = parseInt(req.query.offset, 10);
            if (req.query.latlng) {
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
                this.controller.GetByCoordinates(lat, lng, range, limit, offset).then((data) => {
                    res.status(200)
                        .send(data);
                }).catch((err) => {
                    next(err);
                });
                return;
            } else {
                this.controller.GetAll(limit, offset).then((data) => {
                    res.status(200)
                        .send(data);
                }).catch((err) => {
                    next(err);
                });
            }
        });

        this.router.get("/:id", (req: Request, res: Response, next) => {
            const id = +req.params.id;
            if (isNaN(id)) {
                next(new CustomError("Bad request - wrong input parameters", true, 400));
                return;
            }
            this.controller.GetOne(id).then((data) => {
                res.status(200)
                    .send(data);
            }).catch((err) => {
                next(err);
            });
        });
    }

}

export default new ParkingsRouter().router;
