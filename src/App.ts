"use strict";
/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as express from "express";

import * as mongoose from "mongoose";

import CustomError from "./helpers/errors/CustomError";

// Import ParkingsController from controllers entry point
import ParkingsRouter from "./routes/ParkingsRouter";

import handleError from "./helpers/errors/ErrorHandler";

const log = require("debug")("data-platform:output-gateway");
const errorLog = require("debug")("data-platform:error");

const config = require("../config.js");

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
class App {

    // Create a new express application instance
    public express: express.Application = express();
    // The port the express app will listen on
    public port: number = config.app_port || 3000;

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

    private middleware = (): void => {
        // todo
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

        this.express.use((req, res, next) => {
            next(new CustomError("Not found", true, 404));
        });

        this.express.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            handleError(err).then((error) => {
                if (error) {
                    res.status(error.error_status || 500).send(error);
                }
            });
        });
    }

    private database = async (): Promise<void> => {
        const uri: string = config.mongo_connection;
        await mongoose.connect(uri, {
            autoReconnect: true,
            useNewUrlParser: true,
        });
        log("Connected to DB!");
        mongoose.connection.on("disconnected", () => {
            handleError(new CustomError("Database disconnected", false));
        });
    }
}

module.exports = new App().start();
