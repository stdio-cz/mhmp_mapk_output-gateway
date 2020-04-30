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

    /**
     * Performs a final check on the data before sending them to the client (response)
     * @param data data to be sent to response
     */
    protected async CheckBeforeSendingData(data: any) {
        if (data.length > config.pagination_max_limit) {
            throw new CustomError("Pagination limit error", true, "BaseRouter", 413);
        }
        return data;
    }
}
