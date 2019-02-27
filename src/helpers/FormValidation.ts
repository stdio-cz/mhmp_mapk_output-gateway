import {validationResult} from "express-validator/check";
import CustomError from "./errors/CustomError";

export const checkErrors = (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new CustomError("Validation error", true, 400, errors.mapped());
    }

    next();
};
