import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { query } from "express-validator/check";
import config from "../../config/config";
import { parseCoordinates } from "../../core/Geo";
import { useCacheMiddleware } from "../../core/redis";
import {
    checkErrors,
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";
import { SortedWasteMeasurementsModel, SortedWastePicksModel, SortedWasteStationsModelPg } from "./models";

import { BaseRouter } from "../../core/routes/BaseRouter";

export class SortedWasteRouterPg extends BaseRouter {
    protected stationsModel: SortedWasteStationsModelPg;
    protected measurementsModel: SortedWasteMeasurementsModel = new SortedWasteMeasurementsModel();
    protected picksModel: SortedWastePicksModel = new SortedWastePicksModel();

    public constructor() {
        super();
        this.stationsModel = new SortedWasteStationsModelPg();

        this.router.get("/measurements", [
            query("containerId").optional().isString(),
            query("from").optional().isISO8601(),
            query("to").optional().isISO8601(),
        ],
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("SortedWasteRouter"),
            useCacheMiddleware(),
            this.GetMeasurements,
        );
        this.router.get("/picks",
            [
                query("containerId").optional().isString(),
                query("from").optional().isISO8601(),
                query("to").optional().isISO8601(),
            ],
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("SortedWasteRouter"),
            useCacheMiddleware(),
            this.GetPicks,
        );

        this.router.get("/",
            [
                query("accessibility").optional().isNumeric(),
                query("onlyMonitored").optional().isBoolean(),
                query("districts").optional(),
                query("districts.*").isString(),
                // query("ids").optional(),
                query("latlng").optional().isString(),
                query("range").optional().isNumeric(),
            ],
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("SortedWasteRouter"),
            useCacheMiddleware(),
            this.GetAll,
        );
        this.router.get("/:id",
            checkErrors,
            useCacheMiddleware(),
            this.GetOne,
        );
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let data = await this.stationsModel.GetAll({
                id: req.params.id,
            });

            data = await this.CheckBeforeSendingData(data) ;

            if (data?.features[0]) {
                return res.status(200).send(data.features[0]);
            } else {
                return res.status(404).send();
            }
        } catch (err) {
            next(err);
        }
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {
        let districts: any = req.query.districts;

        if (districts && !(districts instanceof Array)) {
            districts = districts.split(",");
        }

        try {
            const coords = await parseCoordinates(req.query.latlng, req.query.range);

            let data = await this.stationsModel.GetAll({
                accessibility: req.query.accessibility,
                districts,
                id: req.params.id,
                lat: coords.lat,
                limit: req.query.limit,
                lng: coords.lng,
                offset: req.query.offset,
                onlyMonitored: req.query.onlyMonitored,
                range: coords.range,
            });

            data = await this.CheckBeforeSendingData(data);

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetMeasurements = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.measurementsModel.GetAll( {
                containerId: req.query.containerId,
                from: req.query.from,
                limit: req.query.limit,
                offset: req.query.offset,
                to: req.query.to,
            });

            if (data.length > config.pagination_max_limit) {
                throw new CustomError("Pagination limit error", true, "SortedWasteRouter", 413);
            }

            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }

    public GetPicks = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await this.picksModel.GetAll({
                containerId: req.query.containerId,
                from: req.query.from,
                limit: req.query.limit,
                offset: req.query.offset,
                to: req.query.to,
            });
            res.status(200).send(data);
        } catch (err) {
            next(err);
        }
    }
}

const sortedWasteRouterPg: Router = new SortedWasteRouterPg().router;

export { sortedWasteRouterPg };
