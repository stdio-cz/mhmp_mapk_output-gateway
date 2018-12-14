/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import { NextFunction, Request, Response, Router } from "express";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";
import VehiclePositionsModel from "../models/VehiclePositionsModel";
import log from "../helpers/Logger";

export class VehiclePositionsRouter {
    protected model: VehiclePositionsModel;
    
    // Assign router to the express.Router() instance
    public router: Router = Router();

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.router.get("/", this.GetAll);
        this.router.get("/:id", this.GetOne);
    }

    public constructor(){
        this.model = new VehiclePositionsModel();
        this.initRoutes();
    }

    public GetAll = (req: Request, res: Response, next: NextFunction) => {
        this.model.GetAll().then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetOne = (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id;

        this.model.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }
}

export default new VehiclePositionsRouter().router;