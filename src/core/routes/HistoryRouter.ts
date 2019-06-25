import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
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
        this.router.get("/", [
            query("from").optional().isISO8601(),
            query("to").optional().isISO8601(),
        ], pagination, checkErrors, this.GetAll);
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
