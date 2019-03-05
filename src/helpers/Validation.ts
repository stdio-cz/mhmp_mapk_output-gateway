import {query, validationResult} from "express-validator/check";
import CustomError from "./errors/CustomError";

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
    query("page").optional().isInt({min: 1}),
    (req: any, res: any, next: any) => {
        !req.query.search && (req.query.search = false);
        req.query.limit && !req.query.page && (req.query.page = 1);
        req.query.limit && (req.query.limit = parseInt(req.query.limit, 10));
        if (req.query.limit && req.query.page) {
            req.query.offset = (req.query.page - 1) * req.query.limit;
        }
        next();
    },
];
