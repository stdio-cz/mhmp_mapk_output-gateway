"use strict";
/* app/server.ts */

// Import everything from express and assign it to the express variable
import * as express from "express";

import { NextFunction, Request, Response, Router } from "express";

import * as httpLogger from "morgan";

import * as fs from "fs";

import * as path from "path";

import * as mongoose from "mongoose";

import config from "./config/config";

import { CustomError } from "./core/errors";

import { handleError } from "./core/errors";

import { log } from "./core/Logger";

import { IDatasetDefinition, RouterBuilder } from "./core/routes/";

import { parkingZonesRouter } from "./resources/parkingzones/ParkingZonesRouter";

import { sortedWasteRouter } from "./resources/sortedwastestations/SortedWasteRouter";

import { cityDistrictsRouter } from "./resources/citydistricts/CityDistrictsRouter";

import { vehiclepositionsRouter } from "./resources/vehiclepositions/VehiclePositionsRouter";

import { gtfsRouter } from "./resources/gtfs/GTFSRouter";

import { sequelizeConnection } from "./core/database";

import { mongooseConnection } from "./core/database";

import {
    AirQualityStations,
    BicycleParkings,
    Gardens,
    IceGatewaySensors,
    IceGatewayStreetLamps,
    MedicalInstitutions,
    Meteosensors,
    MunicipalPoliceStations,
    Parkings,
    Playgrounds,
    PublicToilets,
    SharedBikes,
    SharedCars,
    TrafficCameras,
    WasteCollectionYards,
} from "golemio-schema-definitions";

import * as http from "http";
import { medicalInstitutionsRouter } from "./resources/medicalinstitutions/MedicalInstitutionsRouter";
import { municipalAuthoritiesRouter } from "./resources/municipalauthorities/MunicipalAuthoritiesRouter";

export const generalRoutes = [
    {
        collectionName: IceGatewayStreetLamps.mongoCollectionName,
        name: IceGatewayStreetLamps.name,
        schema: IceGatewayStreetLamps.outputMongooseSchemaObject,
    },
    {
        collectionName: IceGatewaySensors.mongoCollectionName,
        history:
        {
            collectionName: IceGatewaySensors.history.mongoCollectionName,
            name: IceGatewaySensors.history.name,
            schema: IceGatewaySensors.history.outputMongooseSchemaObject,
        },
        name: IceGatewaySensors.name,
        schema: IceGatewaySensors.outputMongooseSchemaObject,
    },
    {
        collectionName: SharedCars.mongoCollectionName,
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
        collectionName: Gardens.mongoCollectionName,
        name: Gardens.name,
        schema: Gardens.outputMongooseSchemaObject,
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
        collectionName: Playgrounds.mongoCollectionName,
        name: Playgrounds.name,
        schema: Playgrounds.outputMongooseSchemaObject,
    },
    {
        collectionName: MunicipalPoliceStations.mongoCollectionName,
        name: MunicipalPoliceStations.name,
        schema: MunicipalPoliceStations.outputMongooseSchemaObject,
    },
    {
        collectionName: WasteCollectionYards.mongoCollectionName,
        name: WasteCollectionYards.name,
        schema: WasteCollectionYards.outputMongooseSchemaObject,
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
        collectionName: SharedBikes.mongoCollectionName,
        name: SharedBikes.name,
        schema: SharedBikes.outputMongooseSchemaObject,
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

    private commitSHA: string;

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
            this.commitSHA = await this.loadCommitSHA();
            log.info(`Commit SHA: ${this.commitSHA}`);
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
                commit_sha: this.commitSHA,
                status: "Up",
                version: config.app_version,
            });
        });

        // Create specific routes with their own router
        this.express.use("/", defaultRouter);
        this.express.use("/citydistricts", cityDistrictsRouter);
        this.express.use("/gtfs", gtfsRouter);
        this.express.use("/medicalinstitutions", medicalInstitutionsRouter);
        this.express.use("/municipalauthorities", municipalAuthoritiesRouter);
        this.express.use("/parkingzones", parkingZonesRouter);
        this.express.use("/sortedwastestations", sortedWasteRouter);
        this.express.use("/vehiclepositions", vehiclepositionsRouter);

        // Create general routes through builder
        const builder: RouterBuilder = new RouterBuilder(defaultRouter);
        builder.LoadData(
            [
                {
                    collectionName: IceGatewayStreetLamps.mongoCollectionName,
                    name: IceGatewayStreetLamps.name,
                    schema: IceGatewayStreetLamps.outputMongooseSchemaObject,
                },
                {
                    collectionName: IceGatewaySensors.mongoCollectionName,
                    history:
                    {
                        collectionName: IceGatewaySensors.history.mongoCollectionName,
                        historyTimePropertyLocation: "created_at",
                        name: IceGatewaySensors.history.name,
                        schema: IceGatewaySensors.history.outputMongooseSchemaObject,
                    },
                    name: IceGatewaySensors.name,
                    schema: IceGatewaySensors.outputMongooseSchemaObject,
                },
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
                    collectionName: Gardens.mongoCollectionName,
                    name: Gardens.name,
                    schema: Gardens.outputMongooseSchemaObject,
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
                    collectionName: Playgrounds.mongoCollectionName,
                    name: Playgrounds.name,
                    schema: Playgrounds.outputMongooseSchemaObject,
                },
                {
                    collectionName: MunicipalPoliceStations.mongoCollectionName,
                    name: MunicipalPoliceStations.name,
                    schema: MunicipalPoliceStations.outputMongooseSchemaObject,
                },
                {
                    collectionName: WasteCollectionYards.mongoCollectionName,
                    name: WasteCollectionYards.name,
                    schema: WasteCollectionYards.outputMongooseSchemaObject,
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
                    collectionName: SharedBikes.mongoCollectionName,
                    expire: 30000,
                    name: SharedBikes.name,
                    schema: SharedBikes.outputMongooseSchemaObject,
                },
                {
                    collectionName: BicycleParkings.mongoCollectionName,
                    name: BicycleParkings.name,
                    schema: BicycleParkings.outputMongooseSchemaObject,
                },
            ],
        );
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

    /**
     * Loading the Commit SHA of the current build
     */
    private loadCommitSHA = async (): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(__dirname, "..", "commitsha"), (err, data) => {
                if (err) {
                    return resolve(undefined);
                }
                return resolve(data.toString());
            });
        });
    }
}
