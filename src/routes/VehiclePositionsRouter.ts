/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import {NextFunction, Request, Response, Router} from "express";
import CustomError from "../helpers/errors/CustomError";
import {VehiclePositionsTripsModel} from "../models/VehiclePositionsTripsModel";
import {models} from "../models";

export class VehiclePositionsRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: VehiclePositionsTripsModel;

    public constructor() {
        this.model = models.VehiclePositionsTripsModel;
        this.initRoutes();
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.model.GetAll();
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        const id: number = req.params.id;

        try {
            const data = await this.model.GetOne(id);
            if (!data) {
                throw new CustomError("not_found", true, 404, null);
            }
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.router.get("/", this.GetAll);
        this.router.get("/:id", this.GetOne);
    }
}

export default new VehiclePositionsRouter().router;
