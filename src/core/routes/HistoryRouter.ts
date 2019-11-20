import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { query, ValidationChain } from "express-validator/check";
import { Schema } from "mongoose";
import { log } from "../Logger";
import { HistoryModel } from "../models";
import { useCacheMiddleware } from "../redis";
import { checkErrors, pagination } from "../Validation";
import { BaseRouter } from "./BaseRouter";

export class HistoryRouter extends BaseRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: HistoryModel;

    public constructor(inModel: HistoryModel) {
        super();
        this.model = inModel;
    }

    public initRoutes = async (expire?: number | string) => {
        const sensorIdParam = await this.GetIdQueryParamWithCorrectType();
        this.router.get("/",
            useCacheMiddleware(expire),
            [
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
                sensorIdParam,
            ], pagination, checkErrors, this.GetAll);
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        const timestampFrom = new Date(req.query.from).getTime();
        const timestampTo = new Date(req.query.to).getTime();
        let sensorIds = req.query.ids;
        if (sensorIds) {
            sensorIds = this.ConvertToArray(sensorIds);
        }
        try {
            let data = await this.model.GetAll({
                from: timestampFrom,
                limit: req.query.limit,
                offset: req.query.offset,
                sensorId: req.query.sensorId,
                to: timestampTo,
            });

            data = await this.CheckBeforeSendingData(data);

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    protected GetIdQueryParamWithCorrectType = async (): Promise<ValidationChain> => {
        let sensorIdParam: ValidationChain;
        return await this.model.GetSchema().then((schema) => {
            // Get the location of the ID of the sensor (the attribute name)
            const idKey = this.model.primarySensorIdPropertyLocation;
            let message: string = "Created history model " + this.model.GetName() + " has ID of sensor `"
                + idKey + "` of type ";
            // ID of the sensor has type "Number" in the schema
            if (schema.path(idKey) instanceof Schema.Types.Number) {
                message += "number.";
                // Create a query parameter (which validates by express-validator) for detail route with type number
                sensorIdParam = query("sensorId.*").optional().isNumeric();
                // ID of the sensor has type "String" in the schema
            } else {
                message += "string.";
                // Create a query parameter (which validates by express-validator) for detail route with type string
                sensorIdParam = query("sensorId.*").optional().isString();
            }
            log.silly(message);
            return sensorIdParam;
        });
    }
}
