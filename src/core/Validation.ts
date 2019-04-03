import { query, validationResult } from "express-validator/check";
import { CustomError } from "./errors/CustomError";

export const checkErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new CustomError("Validation error", true, 400, errors.mapped());
    }

    next();
};

export const pagination = [
    query("search").optional(),
    query("limit").optional().isInt({min: 1}),
    query("offset").optional().isInt({min: 1}),
    (req: any, res: any, next: any) => {
        !req.query.search && (req.query.search = false);
        req.query.limit && (req.query.limit = parseInt(req.query.limit, 10));
        req.query.offset && (req.query.offset = parseInt(req.query.offset, 10));
        next();
    },
];
