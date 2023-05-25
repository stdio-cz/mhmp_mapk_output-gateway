import { BaseApp, getServiceHealth, IServiceCheck, Service } from "@golemio/core/dist/helpers";
import { initSentry, metricsService } from "@golemio/core/dist/monitoring";
import { config } from "@golemio/core/dist/output-gateway/config/config";
import { sequelizeConnection } from "@golemio/core/dist/output-gateway/database";
import { log, requestLogger } from "@golemio/core/dist/output-gateway/Logger";
import { CacheMiddleware, RedisConnector } from "@golemio/core/dist/output-gateway/redis";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import {
    ErrorHandler,
    FatalError,
    GeneralError,
    HTTPErrorHandler,
    IGolemioError,
} from "@golemio/core/dist/shared/golemio-errors";
import { createLightship, Lightship } from "@golemio/core/dist/shared/lightship";
import sentry from "@golemio/core/dist/shared/sentry";
import compression from "compression";
import http from "http";
import swaggerUi from "swagger-ui-express";
import {
    airQualityRouter,
    bicycleCountersRouter,
    cityDistrictsRouter,
    exportingModuleRouter,
    fcdRouter,
    gardensRouter,
    medicalInstitutionsRouter,
    microclimateRouter,
    municipalAuthoritiesRouter,
    municipalLibrariesRouter,
    municipalPoliceStationsRouter,
    parkingsRouter,
    pedestriansRouter,
    playgroundsRouter,
    sharedBikesGbfsRouter,
    sharedBikesRouter,
    sharedCarsRouter,
    trafficRouter,
    tskParkingLotsLegacyRouter,
    wasteCollectionLegacyRouter,
    wasteCollectionYardsRouter,
} from "./routers";

/**
 * Entry point of the application. Creates and configures an ExpressJS web server.
 */
export default class App extends BaseApp {
    public express: express.Application = express();
    public port: number = parseInt(config.port || "3004", 10);
    private server?: http.Server;
    public metricsServer?: http.Server;
    private commitSHA!: string;
    private lightship: Lightship;

    /**
     * Run configuration methods on the Express instance
     */
    constructor() {
        super();
        this.lightship = createLightship({
            detectKubernetes: config.node_env !== "production",
            shutdownHandlerTimeout: config.lightship.handlerTimeout,
            gracefulShutdownTimeout: config.lightship.shutdownTimeout,
            shutdownDelay: config.lightship.shutdownDelay,
        });
        process.on("uncaughtException", (err: Error) => {
            log.error(err);
            this.lightship.shutdown();
        });
        process.on("unhandledRejection", (reason: any) => {
            log.error(reason);
            this.lightship.shutdown();
        });
    }

    /**
     * Start the application and runs the server
     */
    public start = async (): Promise<void> => {
        try {
            this.express = express();
            initSentry(config.sentry, config.app_name, this.express);
            metricsService.init(config, log);
            this.commitSHA = this.loadCommitSHA();
            log.info(`Commit SHA: ${this.commitSHA}`);
            await this.database();
            this.middleware();
            this.routes();
            this.errorHandlers();
            this.metricsServer = metricsService.serveMetrics();
            this.server = http.createServer(this.express);
            // Setup error handler hook on server error
            this.server.on("error", (err: Error) => {
                sentry.captureException(err);
                ErrorHandler.handle(new FatalError("Could not start a server", "App", err), log);
            });
            // Serve the application at the given port
            this.server.listen(this.port, () => {
                // Success callback
                log.info(`Listening at http://localhost:${this.port}/`);
            });
            this.lightship.registerShutdownHandler(async () => {
                await this.gracefulShutdown();
            });
            this.lightship.signalReady();
        } catch (err) {
            sentry.captureException(err);
            ErrorHandler.handle(err, log);
        }
    };

    /**
     * Graceful shutdown - terminate connections and server
     */
    private gracefulShutdown = async (): Promise<void> => {
        log.info("Graceful shutdown initiated.");
        await this.stop();
        await this.metricsServer?.close();
        await sequelizeConnection.close();
        if (config.redis_enable) {
            await RedisConnector.disconnect();
        }
    };

    public stop = async (): Promise<void> => {
        this.server?.close();
    };

    private database = async (): Promise<void> => {
        await sequelizeConnection?.authenticate();
        if (config.redis_enable) {
            await RedisConnector.connect();
        }
    };

    /**
     * Set custom headers
     */
    private customHeaders = (_req: Request, res: Response, next: NextFunction): void => {
        res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD");
        next();
    };

    /**
     * Bind middleware to express server
     */
    private middleware = (): void => {
        this.express.use((req, res, next) => {
            const beacon = this.lightship.createBeacon();
            res.on("finish", () => {
                beacon.die();
            });
            next();
        });
        this.express.use(sentry.Handlers.requestHandler() as express.RequestHandler);
        this.express.use(sentry.Handlers.tracingHandler() as express.RequestHandler);
        this.express.use(metricsService.metricsMiddleware());
        this.express.use(requestLogger);
        this.express.use(this.commonHeaders);
        this.express.use(this.customHeaders);
        this.express.use(compression());
        CacheMiddleware.init();
    };

    private healthCheck = async () => {
        const description = {
            app: "Golemio Data Platform Output Gateway",
            commitSha: this.commitSHA,
            version: config.app_version,
        };

        const services: IServiceCheck[] = [
            {
                name: Service.POSTGRES,
                check: () =>
                    sequelizeConnection
                        .authenticate()
                        .then(() => true)
                        .catch(() => false),
            },
        ];

        if (config.redis_enable) {
            services.push({ name: Service.REDIS, check: () => Promise.resolve(RedisConnector.isConnected()) });
        }

        const serviceStats = await getServiceHealth(services);

        return { ...description, ...serviceStats };
    };

    /**
     * Define express server routes
     */
    private routes = (): void => {
        const defaultRouter: express.Router = express.Router();

        // Create base url route handler
        defaultRouter.get(
            ["/", "/health-check", "/status"],
            async (req: express.Request, res: express.Response, next: express.NextFunction) => {
                try {
                    const healthStats = await this.healthCheck();
                    if (healthStats.health) {
                        return res.json(healthStats);
                    } else {
                        return res.status(503).send(healthStats);
                    }
                } catch (err) {
                    return res.status(503);
                }
            }
        );

        // Create specific routes with their own router
        this.express.use("/", defaultRouter);
        this.express.use("/airqualitystations", airQualityRouter);
        this.express.use("/bicyclecounters", bicycleCountersRouter);
        this.express.use("/citydistricts", cityDistrictsRouter);
        this.express.use("/export", exportingModuleRouter);
        this.express.use("/medicalinstitutions", medicalInstitutionsRouter);
        this.express.use("/municipalauthorities", municipalAuthoritiesRouter);
        this.express.use("/municipallibraries", municipalLibrariesRouter);
        this.express.use("/gardens", gardensRouter);
        this.express.use("/sortedwastestations", wasteCollectionLegacyRouter);
        this.express.use("/wastecollectionyards", wasteCollectionYardsRouter);
        this.express.use("/playgrounds", playgroundsRouter);
        this.express.use("/sharedbikes", sharedBikesRouter);
        this.express.use("/sharedbikes/gbfs", sharedBikesGbfsRouter);
        this.express.use("/sharedcars", sharedCarsRouter);
        this.express.use("/parking", parkingsRouter);
        this.express.use("/parkings", tskParkingLotsLegacyRouter);
        this.express.use("/pedestrians", pedestriansRouter);
        this.express.use("/traffic", trafficRouter);
        this.express.use("/fcd", fcdRouter);
        this.express.use("/municipalpolicestations", municipalPoliceStationsRouter);
        this.express.use("/microclimate", microclimateRouter);

        // ApiDocs
        this.express.use(
            "/docs/openapi",
            swaggerUi.serveFiles(require("../docs/generated/openapi.json"), {}),
            swaggerUi.setup(require("../docs/generated/openapi.json"))
        );
        this.express.use(
            "/docs/public-openapi",
            swaggerUi.serveFiles(require("../docs/generated/public-openapi.json"), {}),
            swaggerUi.setup(require("../docs/generated/public-openapi.json"))
        );
    };

    /**
     * Define error handling middleware
     */
    private errorHandlers = (): void => {
        this.express.use(sentry.Handlers.errorHandler({ shouldHandleError: () => true }) as express.ErrorRequestHandler);

        // Not found error - no route was matched
        this.express.use((req, _res, next) => {
            next(new GeneralError("Route not found", "App", new Error(`Called ${req.method} ${req.url}`), 404));
        });

        // Error handler to catch all errors sent by routers (propagated through next(err))
        this.express.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
            const warnCodes = [400, 404];
            const errObject: IGolemioError = HTTPErrorHandler.handle(err, log, warnCodes.includes(err.code) ? "warn" : "error");
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    };
}
