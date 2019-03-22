/**
 * app/routers/ParkingZonesRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

// Import only what we need from express
import {NextFunction, Request, Response, Router} from "express";
import {param, query} from "express-validator/check";
import CustomError from "../helpers/errors/CustomError";
import {checkErrors, pagination} from "../helpers/Validation";
import {models} from "../models";
import {VehiclePositionsTripsModel} from "../models/VehiclePositionsTripsModel";

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
            const data = await this.model.GetAll({
                includeGTFS: req.query.includeGTFS || false,
                includePositions: req.query.includePositions || false,
                limit: req.query.limit,
                offset: req.query.offset,
                routeId: req.query.routeId,
                routeShortName: req.query.routeShortName,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        try {
            const data = await this.model.GetOne(id, {
                    includeGTFS: req.query.includeGTFS || false,
                    includePositions: req.query.includePositions || false,
                },
            );
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
        this.router.get("/", [
            query("routeId").optional(),
            query("routeShortName").optional(),
            query("includePositions").optional().isBoolean(),
            query("includeGTFS").optional().isBoolean(),
        ], pagination, checkErrors, this.GetAll);
        this.router.get("/:id", [
            param("id").exists(),
            query("includePositions").optional().isBoolean(),
            query("includeGTFS").optional().isBoolean(),
        ], checkErrors, this.GetOne);
    }
}

export default new VehiclePositionsRouter().router;
