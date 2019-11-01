import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import config from "../../config/config";
import { log } from "../Logger";
import { BaseModel } from "../models";

/**
 * Router /WEB LAYER/: maps routes to specific model functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */
export class BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: BaseModel;

    /**
     * Performs a final check on the data before sending them to the client (response)
     * @param data data to be sent to response
     */
    protected async CheckBeforeSendingData(data: any) {
        if (data.length > config.pagination_max_limit) {
            throw new CustomError("Pagination limit error", true, "GeoJsonRouter", 413);
        }
        return data;
    }
}
