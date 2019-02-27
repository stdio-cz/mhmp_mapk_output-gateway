/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import {NextFunction, Request, Response, Router} from "express";
import {param} from "express-validator/check";
import CustomError from "../helpers/errors/CustomError";
import handleError from "../helpers/errors/ErrorHandler";
import {checkErrors} from "../helpers/FormValidation";
import log from "../helpers/Logger";
import {GTFSTripsModel} from "../models/GTFSTripsModel";

export class GTFSRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected tripModel: GTFSTripsModel;

    public constructor() {
        this.tripModel = new GTFSTripsModel();
        this.initRoutes();
    }

    public GetAllTrips = (req: Request, res: Response, next: NextFunction) => {
        this.tripModel.GetAll().then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    public GetOneTrip = (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id;

        this.tripModel.GetOne(id).then((data) => {
            res.status(200)
                .send(data);
        }).catch((err) => {
            next(err);
        });
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.router.get("/trips", this.GetAllTrips);
        this.router.get("/trips/:id", [
            param("id").exists().isInt({min: 1}),
        ], checkErrors, this.GetOneTrip);
    }
}

export default new GTFSRouter().router;
