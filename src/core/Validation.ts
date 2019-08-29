import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response } from "express";
import { query, validationResult } from "express-validator/check";

/**
 * Checks for errors in request parameters, using express-validator https://www.npmjs.com/package/express-validator
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @throws Error if request contains validation errors
 * @returns Void, calls next() function
 */
export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new CustomError("Validation error", true, "Validation", 400, errors.mapped());
    }
    next();
};

/**
 * Sets up pagination query parameters
 */
export const pagination = [
    query("limit").optional().isInt({ min: 1 }),
    query("offset").optional().isInt({ min: 0 }),
    (req: Request, res: Response, next: NextFunction) => {
        req.query.limit && (req.query.limit = parseInt(req.query.limit, 10));
        req.query.offset && (req.query.offset = parseInt(req.query.offset, 10));
        next();
    },
];
