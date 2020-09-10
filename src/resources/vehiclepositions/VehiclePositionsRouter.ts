/**
 *
 * Router /WEB LAYER/: maps routes to specific controller functions, passes request parameters and handles responses.
 * Handles web logic (http request, response). Sets response headers, handles error responses.
 */

import { CustomError } from "@golemio/errors";
import { NextFunction, Request, Response, Router } from "express";
import { param, query } from "express-validator/check";
import * as moment from "moment-timezone";
import config from "../../config/config";
import { IGeoJSONFeature, IGeoJSONFeatureCollection } from "../../core/Geo";
import { hget, useCacheMiddleware } from "../../core/redis";
import { parseBooleanQueryParam } from "../../core/Utils";
import {
    checkErrors,
    checkPaginationLimitMiddleware,
    pagination,
} from "../../core/Validation";
import { models } from "./models";
import { VehiclePositionsTripsModel } from "./models/VehiclePositionsTripsModel";

export class VehiclePositionsRouter {

    // Assign router to the express.Router() instance
    public router: Router = Router();

    protected model: VehiclePositionsTripsModel;

    public constructor() {
        this.model = models.VehiclePositionsTripsModel;
        this.initRoutes(10000);
    }

    public GetAll = async (req: Request, res: Response, next: NextFunction) => {

        const preferredTimezone: string = this.setTargetTimezone(req.query.preferredTimezone);

        try {
            const result = await this.model.GetAll({
                cisTripNumber: req.query.cisTripNumber,
                includeNotTracking: parseBooleanQueryParam(req.query.includeNotTracking),
                includePositions: parseBooleanQueryParam(req.query.includePositions),
                limit: req.query.limit,
                offset: req.query.offset,
                routeId: req.query.routeId,
                routeShortName: req.query.routeShortName,
                updatedSince: req.query.updatedSince ? (new Date(req.query.updatedSince)) : null,
            });
            if (result.data.features.length > config.pagination_max_limit) {
                throw new CustomError("Pagination limit error", true, "VehiclePositionsRouter", 413);
            }
            const response = {
                ...result.data,
                features: result.data.features.map((x: any) => {
                    return {
                        ...x,
                        properties: this.mapPositionItemToISOString(x.properties, preferredTimezone),
                    };
                }),
            };
            res
                .set("X-Last-Modified", moment(result.metadata.max_updated_at).toISOString())
                .status(200).send(response);
        } catch (err) {
            next(err);
        }
    }

    public GetOne = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.id;
        const preferredTimezone: string = this.setTargetTimezone(req.query.preferredTimezone);

        try {
            const data: any = await this.model.GetOne(id, {
                includeNotTracking: parseBooleanQueryParam(req.query.includeNotTracking),
                includePositions: parseBooleanQueryParam(req.query.includePositions),
            },
            );
            if (!data) {
                throw new CustomError("not_found", true, "VehiclePositionsRouter", 404, null);
            }
            const response = {
                ...data,
                properties: this.mapPositionItemToISOString(data.properties, preferredTimezone),
            };
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    }

    public GetGtfsRtTripUpdates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = await hget("files", "trip_updates.pb");
            if (!file) {
                throw new CustomError("not_found", true, "VehiclePositionsRouter", 404, null);
            }
            res.setHeader("Content-Type", "application/octet-stream");
            res.status(200).send(Buffer.from(file, "hex"));
        } catch (err) {
            next(err);
        }
    }

    public GetGtfsRtVehiclePositions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = await hget("files", "vehicle_positions.pb");
            if (!file) {
                throw new CustomError("not_found", true, "VehiclePositionsRouter", 404, null);
            }
            res.setHeader("Content-Type", "application/octet-stream");
            res.status(200).send(Buffer.from(file, "hex"));
        } catch (err) {
            next(err);
        }
    }

    private mapPositionItemToISOString(x: any, preferredTimezone: string) {
        const defaultFeatureObject: IGeoJSONFeatureCollection = {
            features: [],
            type: "FeatureCollection",
        };
        return {
            ...x,
            all_positions: x.all_positions != null ? {
                ...x.all_positions,
                features: x.all_positions.features.map((y: any) => {
                    return {
                        ...y,
                        properties: {
                            ...y.properties,
                            last_stop: {
                                ...y.properties.last_stop,
                                arrival_time: y.properties.last_stop.arrival_time != null ?
                                    this.formatTimestamp(
                                        parseInt(y.properties.last_stop.arrival_time, 10), preferredTimezone) :
                                    null,
                                departure_time: y.properties.last_stop.departure_time != null ?
                                    this.formatTimestamp(
                                        parseInt(y.properties.last_stop.departure_time, 10), preferredTimezone) :
                                    null,
                            },
                            next_stop: {
                                ...y.properties.next_stop,
                                arrival_time: y.properties.next_stop.arrival_time != null ?
                                    this.formatTimestamp(
                                        parseInt(x.last_position.next_stop.arrival_time, 10), preferredTimezone) :
                                    null,
                                departure_time: y.properties.next_stop.departure_time != null ?
                                    this.formatTimestamp(
                                        parseInt(y.properties.next_stop.departure_time, 10), preferredTimezone) :
                                    null,
                            },
                            origin_timestamp: y.properties.origin_timestamp != null ?
                                this.formatTimestamp(parseInt(y.properties.origin_timestamp, 10), preferredTimezone) :
                                null,
                        },
                    };
                }),
            } : defaultFeatureObject,
            last_position: x.last_position != null ? {
                ...x.last_position,
                last_stop: {
                    ...x.last_position.last_stop,
                    arrival_time: x.last_position.last_stop.arrival_time != null ?
                        this.formatTimestamp(
                            parseInt(x.last_position.last_stop.arrival_time, 10), preferredTimezone) :
                        null,
                    departure_time: x.last_position.last_stop.departure_time != null ?
                        this.formatTimestamp(
                            parseInt(x.last_position.last_stop.departure_time, 10), preferredTimezone) :
                        null,
                },
                next_stop: {
                    ...x.last_position.next_stop,
                    arrival_time: x.last_position.next_stop.arrival_time != null ?
                        this.formatTimestamp(
                            parseInt(x.last_position.next_stop.arrival_time, 10), preferredTimezone) :
                        null,
                    departure_time: x.last_position.next_stop.departure_time != null ?
                        this.formatTimestamp(
                            parseInt(x.last_position.next_stop.departure_time, 10), preferredTimezone) :
                        null,
                },
                origin_timestamp: x.last_position.origin_timestamp != null ?
                    this.formatTimestamp(
                        parseInt(x.last_position.origin_timestamp, 10), preferredTimezone) :
                    null,
            } : defaultFeatureObject,
            trip: x.trip != null ? {
                ...x.trip,
                start_timestamp: x.trip.start_timestamp != null ?
                    this.formatTimestamp(
                        parseInt(x.trip.start_timestamp, 10), preferredTimezone) :
                    null,
            } : defaultFeatureObject,
        };
    }

    /**
     * Sets preferred timezone if exists in library (possible to use _ sign instead of URL encoded / sign)
     * default is UTC zulu format
     */
    private setTargetTimezone = (preferredTimezone: any): string => {
        if (preferredTimezone && moment.tz.names().includes(preferredTimezone.replace(/_/g, "/"))) {
            return preferredTimezone;
        } else {
            return "UTC";
        }
    }

    /**
     * Formats tu Zulu format or to preferred timezone by query
     */
    private formatTimestamp = (datetime: number, preferredTimezone: string): string => {
        return preferredTimezone === "UTC" ?
            moment(datetime).toISOString() : moment(datetime).tz(preferredTimezone).toISOString(true);
    }

    /**
     * Initiates all routes. Should respond with correct data to a HTTP requests to all routes.
     * @param {number|string} expire TTL for the caching middleware
     */
    private initRoutes = (expire?: number | string): void => {
        this.router.get("/",
            [
                query("cisTripNumber").optional().isNumeric(),
                query("routeId").optional(),
                query("routeShortName").optional(),
                query("includeNotTracking").optional().isBoolean(),
                query("includePositions").optional().isBoolean(),
                query("updatedSince").optional().isISO8601(),
                query("preferredTimezone").optional().isString(),
            ],
            pagination,
            checkErrors,
            checkPaginationLimitMiddleware("VehiclePositionsRouter"),
            useCacheMiddleware(expire),
            this.GetAll,
        );
        this.router.get("/:id",
            [
                param("id").exists(),
                query("includeNotTracking").optional().isBoolean(),
                query("includePositions").optional().isBoolean(),
                query("preferredTimezone").optional().isString(),
            ],
            checkErrors,
            useCacheMiddleware(expire),
            this.GetOne,
        );
        this.router.get("/gtfsrt/trip_updates.pb",
            this.GetGtfsRtTripUpdates,
        );
        this.router.get("/gtfsrt/vehicle_positions.pb",
            this.GetGtfsRtVehiclePositions,
        );
    }
}

const vehiclepositionsRouter: Router = new VehiclePositionsRouter().router;

export { vehiclepositionsRouter };
