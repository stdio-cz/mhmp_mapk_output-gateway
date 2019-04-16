"use strict";
/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as express from "express";

import { NextFunction, Request, Response, Router } from "express";

import * as httpLogger from "morgan";

import * as mongoose from "mongoose";

import config from "./config/config";

import { CustomError } from "./core/errors";

import { handleError } from "./core/errors";

import { log } from "./core/Logger";

import { RouterBuilder } from "./core/routes/";

import { parkingsRouter } from "./resources/parkings/ParkingsRouter";

import { parkingZonesRouter } from "./resources/parkingzones/ParkingZonesRouter";

import { cityDistrictsRouter } from "./resources/citydistricts/CityDistrictsRouter";

import { vehiclepositionsRouter } from "./resources/vehiclepositions/VehiclePositionsRouter";

import { gtfsRouter } from "./resources/gtfs/GTFSRouter";

import { sequelizeConnection } from "./core/database";

import { mongooseConnection } from "./core/database";

import * as http from "http";

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
export default class App {

    // Create a new express application instance
    public express: express.Application = express();
    // The port the express app will listen on
    public port: number = parseInt(config.port || "3004", 10);

    /**
     * Runs configuration methods on the Express instance
     * and start other necessary services (crons, database, middlewares).
     */
    constructor() {
        //
    }

    // Starts the application and runs the server
    public start = async (): Promise<void> => {
        try {
            await this.database();
            this.express = express();
            this.middleware();
            this.routes();
            const server = http.createServer(this.express);
            // Setup error handler hook on server error
            server.on("error", (err: any) => {
                handleError(new CustomError("Could not start a server", false, 1, err));
            });
            // Serve the application at the given port
            server.listen(this.port, () => {
                // Success callback
                log.info(`Listening at http://localhost:${this.port}/`);
            });
        } catch (err) {
            handleError(err);
        }
    }

    private setHeaders = (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("x-powered-by", "shem");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
        next();
    }

    private database = async (): Promise<void> => {
        const mongoUri: string = config.mongo_connection || "";
        await sequelizeConnection.authenticate();
        await mongooseConnection;
    }

    private middleware = (): void => {
        httpLogger.token("date", () => {
            return new Date().toISOString();
        });
        this.express.use(httpLogger("combined"));

        this.express.use(this.setHeaders);
    }

    private routes = (): void => {
        const defaultRouter = express.Router();

        // Create base url route handler
        defaultRouter.get(["/", "/health-check", "/status"], (req, res, next) => {

            log.silly("Health check/status called.");

            res.json({
                app_name: "Data Platform Output Gateway",
                status: "Up",
                version: config.app_version,
            });
        });

        // Create specific routes with their own router
        this.express.use("/", defaultRouter);
        this.express.use("/citydistricts", cityDistrictsRouter);
        this.express.use("/parkings", parkingsRouter);
        this.express.use("/parkingzones", parkingZonesRouter);
        this.express.use("/vehiclepositions", vehiclepositionsRouter);
        this.express.use("/gtfs", gtfsRouter);

        // Routes for backwards compatibility of the API
        this.express.use("/shared-cars", (req, res) => {
            res.redirect("/sharedcars");
        });

        // Create general routes through builder
        const builder: RouterBuilder = new RouterBuilder(defaultRouter);
        builder.BuildAllRoutes();

        // Not found error - no route was matched
        this.express.use((req, res, next) => {
            next(new CustomError("Not found", true, 404));
        });

        // Error handler to catch all errors sent by routers (propagated through next(err))
        this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            handleError(err).then((error) => {
                if (error) {
                    log.silly("Error caught by the router error handler.");
                    res.setHeader("Content-Type", "application/json; charset=utf-8");
                    res.status(error.error_status || 500).send(error);
                }
            });
        });
    }
}
