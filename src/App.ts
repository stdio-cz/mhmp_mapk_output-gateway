// Import everything from express and assign it to the express variable
import fs from "fs";
import http from "http";
import path from "path";
import * as Sentry from "@sentry/node";
import { CustomError, ErrorHandler, HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { config } from "@golemio/core/dist/output-gateway/config";
import { mongooseConnection, sequelizeConnection } from "@golemio/core/dist/output-gateway/database";
import { getRequestLogger, log } from "@golemio/core/dist/output-gateway/Logger";
import { RouterBuilder } from "@golemio/core/dist/output-gateway/routes";
import { generalRoutes } from "./generalRoutes";
import {
    bicycleCountersRouter,
    cityDistrictsRouter,
    departureBoardsRouter,
    exportingModuleRouter,
    gardensRouter,
    gtfsRouter,
    medicalInstitutionsRouter,
    municipalAuthoritiesRouter,
    parkingRouter,
    parkingZonesRouter,
    pidRouter,
    playgroundsRouter,
    sharedBikesRouter,
    sortedWasteRouter,
    sortedWasteRouterPg,
    vehiclepositionsRouter,
    wasteCollectionYardsRouter,
} from "./routers";

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
export default class App {
    // Create a new express application instance
    public express: express.Application = express();
    // The port the express app will listen on
    public port: number = parseInt(config.port || "3004", 10);

    private server!: http.Server;

    private commitSHA!: string;

    /**
     * Runs configuration methods on the Express instance
     */
    constructor() {
        //
        process.on("uncaughtException", (err: Error) => {
            Sentry.captureException(err);
        });
        process.on("unhandledRejection", (reason, promise) => {
            Sentry.captureException(reason);
        });
        process.on("exit", (code) => {
            Sentry.captureMessage(`Output gateway exited with code: ${code}`);
        });
    }

    // Starts the application and runs the server
    public start = async (): Promise<void> => {
        try {
            if (config.sentry_enable) {
                Sentry.init({
                    dsn: config.sentry_dsn,
                    environment: process.env.NODE_ENV,
                });
            }
            this.express.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
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
            Sentry.captureException(err);
            ErrorHandler.handle(err);
        }
    };

    public stop = async (): Promise<void> => {
        this.server.close();
    };

    private setHeaders = (req: Request, res: Response, next: NextFunction): void => {
        res.setHeader("x-powered-by", "shem");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
        next();
    };

    private database = async (): Promise<void> => {
        const mongoUri: string = config.mongo_connection || "";
        await sequelizeConnection?.authenticate();
        await mongooseConnection;
    };

    private middleware = (): void => {
        this.express.use(getRequestLogger);
        this.express.use(this.setHeaders);
        this.express.use(express.static("public"));
    };

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
        this.express.use("/export", exportingModuleRouter);
        this.express.use("/gtfs", gtfsRouter);
        this.express.use("/medicalinstitutions", medicalInstitutionsRouter);
        this.express.use("/municipalauthorities", municipalAuthoritiesRouter);
        this.express.use("/parkingzones", parkingZonesRouter);
        this.express.use("/sortedwastestations", sortedWasteRouter);
        this.express.use("/sortedwastestationspg", sortedWasteRouterPg);
        this.express.use("/vehiclepositions", vehiclepositionsRouter);
        this.express.use("/gardens", gardensRouter);
        this.express.use("/wastecollectionyards", wasteCollectionYardsRouter);
        this.express.use("/playgrounds", playgroundsRouter);
        this.express.use("/sharedbikes", sharedBikesRouter);
        this.express.use("/pid", pidRouter);
        this.express.use("/parking", parkingRouter);

        // Create general routes through builder
        const builder: RouterBuilder = new RouterBuilder(defaultRouter);
        builder.LoadData(generalRoutes);
        builder.BuildAllRoutes();

        this.express.use(
            Sentry.Handlers.errorHandler({
                shouldHandleError(error: any): boolean {
                    return true;
                },
            }) as express.ErrorRequestHandler
        );

        // Not found error - no route was matched
        this.express.use((req, res, next) => {
            next(new CustomError("Not found", true, "App", 404));
        });

        // Error handler to catch all errors sent by routers (propagated through next(err))
        this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const warnCodes = [400, 404];
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err, warnCodes.includes(err.code) ? "warn" : "error");
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    };

    /**
     * Load the Commit SHA of the current build
     *
     * Only to be used at startup, not in runtime of the application.
     */
    private loadCommitSHA = async (): Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            fs.readFile(path.join(__dirname, "..", "commitsha"), (err: NodeJS.ErrnoException | null, data: Buffer) => {
                if (err) {
                    return resolve("");
                }
                return resolve(data.toString());
            });
        });
    };
}
