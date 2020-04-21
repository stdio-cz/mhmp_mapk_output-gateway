/**
 * app/routers/DepartureBoardsRouter.ts
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { param } from "express-validator/check";
import { useCacheMiddleware } from "../../core/redis";
import { BaseRouter } from "../../core/routes/BaseRouter";
import {
    checkErrors,
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";
import { DepartureBoardsModel } from "./DepartureBoardsModel";

export class DepartureBoardsRouter extends BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected departureBoardsModel: DepartureBoardsModel;

    public constructor() {
        super();
        this.departureBoardsModel = new DepartureBoardsModel();
        this.initRoutes();
    }

    public GetDepartureBoard = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.departureBoardsModel
                .GetOne({ stopId: req.params.id, limit: req.query.limit });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     */
    private initRoutes = (): void => {
        this.initDepartureBoardsEndpoints();
    }

    private initDepartureBoardsEndpoints = (expire?: number | string): void => {
        this.router.get("/:id",
            param("id").exists().isString(),
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("DepartureBoardsRouter"),
            useCacheMiddleware(expire),
            this.GetDepartureBoard,
        );
    }
}

const departureBoardsRouter: Router = new DepartureBoardsRouter().router;

export { departureBoardsRouter };
