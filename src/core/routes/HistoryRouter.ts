import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import { Schema } from "mongoose";
import { log } from "../Logger";
import { HistoryModel } from "../models";
import { checkErrors, pagination } from "../Validation";

export class HistoryRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: HistoryModel;

    public constructor(inModel: HistoryModel) {
        this.model = inModel;
    }

    public initRoutes = async () => {
        let sensorIdParam;
        this.model.GetSchema().then((schema) => {
            // Get the location of the ID of the sensor (the attribute name)
            const idKey = this.model.primarySensorIdPropertyLocation;
            let message: string = "Created history model " + this.model.GetName() + " has ID of sensor `"
            + idKey + "` of type ";
            // ID of the sensor has type "Number" in the schema
            if (schema.path(idKey) instanceof Schema.Types.Number) {
                message += "number.";
                // Create a query parameter (which validates by express-validator) for detail route with type number
                sensorIdParam = query("sensorId").optional().isNumeric();
            // ID of the sensor has type "String" in the schema
            } else {
                message += "string.";
                // Create a query parameter (which validates by express-validator) for detail route with type string
                sensorIdParam = query("sensorId").optional().isString();
            }
            log.silly(message);

            this.router.get("/", [
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
                sensorIdParam,
            ], pagination, checkErrors, this.GetAll);
        });
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        const timestampFrom = new Date(req.query.from).getTime();
        const timestampTo = new Date(req.query.to).getTime();
        try {
            const data = await this.model.GetAll({
                from: timestampFrom,
                limit: req.query.limit,
                offset: req.query.offset,
                sensorId: req.query.sensorId,
                to: timestampTo,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}
