"use strict";
/* app/server.ts */

// Import everything from express and assign it to the express variable
import { CustomError, ErrorHandler, HTTPErrorHandler, ICustomErrorObject } from "@golemio/errors";
import {
    AirQualityStations,
    BicycleParkings,
    Meteosensors,
    MunicipalPoliceStations,
    Parkings,
    PublicToilets,
    SharedCars,
    TrafficCameras,
} from "@golemio/schema-definitions";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import config from "./config/config";
import { mongooseConnection, sequelizeConnection } from "./core/database";
import { getRequestLogger, log } from "./core/Logger";
import { RouterBuilder } from "./core/routes/";
import { bicycleCountersRouter } from "./resources/bicyclecounters";
import { cityDistrictsRouter } from "./resources/citydistricts";
import { departureBoardsRouter } from "./resources/departureboards";
import { gardensRouter } from "./resources/gardens";
import { gtfsRouter } from "./resources/gtfs";
import { medicalInstitutionsRouter } from "./resources/medicalinstitutions";
import { municipalAuthoritiesRouter } from "./resources/municipalauthorities";
import { parkingZonesRouter } from "./resources/parkingzones";
import { playgroundsRouter } from "./resources/playgrounds";
import { sharedBikesRouter } from "./resources/sharedbikes";
import { sortedWasteRouter } from "./resources/sortedwastestations";
import { vehiclepositionsRouter } from "./resources/vehiclepositions";
import { wasteCollectionYardsRouter } from "./resources/wastecollectionyards";

// Configuration of the routes to be dynamically created by RouterBuilder
export const generalRoutes = [
    {
        collectionName: SharedCars.mongoCollectionName,
        expire: 30000,
        name: SharedCars.name,
        schema: SharedCars.outputMongooseSchemaObject,
    },
    {
        collectionName: AirQualityStations.mongoCollectionName,
        history: {
            collectionName: AirQualityStations.history.mongoCollectionName,
            name: AirQualityStations.history.name,
            schema: AirQualityStations.history.outputMongooseSchemaObject,
        },
        name: AirQualityStations.name,
        schema: AirQualityStations.outputMongooseSchemaObject,
    },
    {
        collectionName: Meteosensors.mongoCollectionName,
        name: Meteosensors.name,
        schema: Meteosensors.outputMongooseSchemaObject,
    },
    {
        collectionName: TrafficCameras.mongoCollectionName,
        name: TrafficCameras.name,
        schema: TrafficCameras.outputMongooseSchemaObject,
    },
    {
        collectionName: MunicipalPoliceStations.mongoCollectionName,
        name: MunicipalPoliceStations.name,
        schema: MunicipalPoliceStations.outputMongooseSchemaObject,
    },
    {
        collectionName: PublicToilets.mongoCollectionName,
        name: PublicToilets.name,
        schema: PublicToilets.outputMongooseSchemaObject,
    },
    {
        collectionName: Parkings.mongoCollectionName,
        history: {
            collectionName: Parkings.history.mongoCollectionName,
            name: Parkings.history.name,
            schema: Parkings.history.outputMongooseSchemaObject,
        },
        name: Parkings.name,
        schema: Parkings.outputMongooseSchemaObject,
    },
    {
        collectionName: BicycleParkings.mongoCollectionName,
        name: BicycleParkings.name,
        schema: BicycleParkings.outputMongooseSchemaObject,
    },
];

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
export default class App {
    // Create a new express application instance
    public express: express.Application = express();
    // The port the express app will listen on
    public port: number = parseInt(config.port || "3004", 10);

    private server: http.Server;

    private commitSHA: string;

    /**
     * Runs configuration methods on the Express instance
     */
    constructor() {
        //
    }

    // Starts the application and runs the server
    public start = async (): Promise<void> => {
        try {
            this.commitSHA = await this.loadCommitSHA();
            log.info(`Commit SHA: ${this.commitSHA}`);
            await this.database();
            this.express = express();
            this.middleware();
            this.routes();
            this.server = http.createServer(this.express);
            // Setup error handler hook on server error
            this.server.on("error", (err: Error) => {
                ErrorHandler.handle(new CustomError("Could not start a server", false, "App", 1, err));
            });
            // Serve the application at the given port
            this.server.listen(this.port, () => {
                // Success callback
                log.info(`Listening at http://localhost:${this.port}/`);
            });
        } catch (err) {
            ErrorHandler.handle(err);
        }
    }

    public stop = async (): Promise<void> => {
        this.server.close();
    }

    private setHeaders = (req: Request, res: Response, next: NextFunction): void => {
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
        this.express.use(getRequestLogger);
        this.express.use(this.setHeaders);
        this.express.use(express.static("public"));
    }

    private routes = (): void => {
        const defaultRouter: express.Router = express.Router();

        // Create base url route handler
        defaultRouter.get(["/", "/health-check", "/status"], (req, res, next) => {
            log.silly("Health check/status called.");
            res.json({
                app_name: "Data Platform Output Gateway",
                commit_sha: this.commitSHA,
                status: "Up",
                // Current app version (fron environment variable) according to package.json version
                version: config.app_version,
            });
        });

        // Create specific routes with their own router
        this.express.use("/", defaultRouter);
        this.express.use("/bicyclecounters", bicycleCountersRouter);
        this.express.use("/citydistricts", cityDistrictsRouter);
        this.express.use("/departureboards", departureBoardsRouter);
        this.express.use("/gtfs", gtfsRouter);
        this.express.use("/medicalinstitutions", medicalInstitutionsRouter);
        this.express.use("/municipalauthorities", municipalAuthoritiesRouter);
        this.express.use("/parkingzones", parkingZonesRouter);
        this.express.use("/sortedwastestations", sortedWasteRouter);
        this.express.use("/vehiclepositions", vehiclepositionsRouter);
        this.express.use("/gardens", gardensRouter);
        this.express.use("/wastecollectionyards", wasteCollectionYardsRouter);
        this.express.use("/playgrounds", playgroundsRouter);
        this.express.use("/sharedbikes", sharedBikesRouter);

        // Create general routes through builder
        const builder: RouterBuilder = new RouterBuilder(defaultRouter);
        builder.LoadData(generalRoutes);
        builder.BuildAllRoutes();

        // Not found error - no route was matched
        this.express.use((req, res, next) => {
            next(new CustomError("Not found", true, "App", 404));
        });

        // Error handler to catch all errors sent by routers (propagated through next(err))
        this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const warnCodes = [400, 404];
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err, (warnCodes.includes(err.code) ? "warn" : "error"));
            log.silly("Error caught by the router error handler.");
            res.setHeader(
                "Content-Type",
                "application/json; charset=utf-8",
            );
            res.status(errObject.error_status || 500).send(errObject);
        });
    }

    /**
     * Load the Commit SHA of the current build
     *
     * Only to be used at startup, not in runtime of the application.
     */
    private loadCommitSHA = async (): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(__dirname, "..", "commitsha"), (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if (err) {
                    return resolve(undefined);
                }
                return resolve(data.toString());
            });
        });
    }
}
