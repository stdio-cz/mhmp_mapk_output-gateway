"use strict";
/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as express from "express";

import { NextFunction, Request, Response, Router } from "express";

import * as httpLogger from "morgan";

import * as mongoose from "mongoose";

import CustomError from "./helpers/errors/CustomError";

import Database from "./helpers/Database";

import ParkingsRouter from "./routes/ParkingsRouter";

import ParkingZonesRouter from "./routes/ParkingZonesRouter";

import handleError from "./helpers/errors/ErrorHandler";

const config = require("./config/config");

const log = require("debug")("data-platform:output-gateway");
const errorLog = require("debug")("data-platform:error");

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
class App {

    // Create a new express application instance
    public express: express.Application = express();
    // The port the express app will listen on
    public port: number = parseInt(config.port || "3000", 10);

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
            // Serve the application at the given port
            this.express.listen(this.port, () => {
                // Success callback
                log(`Listening at http://localhost:${this.port}/`);
            });
        } catch (err) {
            handleError(err);
        }
    }

    private setHeaders = (req: Request, res: Response, next: NextFunction) => {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
        next();
    }

    private middleware = (): void => {
        if (config.node_env === "development"){
            this.express.use(httpLogger("dev"));
        } else {
            this.express.use(httpLogger("combined"));
        }

        this.express.use(this.setHeaders);
    }

    private routes = (): void => {
        const defaultRouter = express.Router();

        // base url route handler
        defaultRouter.get(["/", "/health-check"], (req, res, next) => {
            res.json({
                app_name: "Data Platform Output Gateway",
                status: "Up",
                version: config.app_version,
            });
        });

        this.express.use("/", defaultRouter);
        // Mount the ParkingsRouter at the /parkings route
        this.express.use("/parkings", ParkingsRouter);

        this.express.use("/parkingzones", ParkingZonesRouter);


        // Not found error - no route was matched
        this.express.use((req, res, next) => {
            next(new CustomError("Not found", true, 404));
        });

        // Error handler to catch all errors sent by routers (propagated through next(err))
        this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            handleError(err).then((error) => {
                if (error) {
                    res.status(error.error_status || 500).send(error);
                }
            });
        });
    }

    private database = async (): Promise<void> => {
        const uri: string = config.mongo_connection || "";
        return new Database(uri).connect();
    }
}

module.exports = new App().start();
