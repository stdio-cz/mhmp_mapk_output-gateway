import { Router } from "express";
import { SchemaDefinition } from "mongoose";
import { GeoJsonRouter, HistoryRouter } from ".";
import { log } from "../Logger";
import { GeoJsonModel, HistoryModel } from "../models";

export interface IDatasetDefinition {
    name: string;
    schema: SchemaDefinition;
    collectionName: string;
    history?: IDatasetDefinition;
    historyTimePropertyLocation?: string;
    expire?: number | string;
}

/**
 * General router builder. Creates routes on top of passed Express router
 * based on data about desired routes - their type, name (base url) and schema of the data to be returned
 *
 * For GeoJSON data, automatically creates / and /:id routes,
 * adds filtering parameters (geo, city district, limit, offset, last updated)
 */
export class RouterBuilder {
    /**
     * Router instance to build all the routes on
     */
    private router: Router;
    /**
     * Routes data - name (base url) of the routes, data schemas and (optional) collection name
     */
    private routesData: Array<{ name: string, schema: SchemaDefinition, collectionName: string }>;

    constructor(inRouter: Router) {
        this.router = inRouter;
    }

    /**
     *
     * @param inName Name of the route, serves as base url for the route's requests {base router}/{inName}/
     * @param inModel Model whose methods are to be mounted on the routes
     *
     * Creates a router with the model's methods mounted on {inName}/...
     */
    public CreateGeojsonRoute(inName: string, inModel: GeoJsonModel, expire?: number | string) {
        const generalRouter = new GeoJsonRouter(inModel);
        generalRouter.initRoutes(expire);
        this.router.use(inName, generalRouter.router);
    }

    /**
     *
     * @param inName Name of the route, serves as base url for the route's requests {base router}/{inName}/
     * @param inModel Model whose methods are to be mounted on the routes
     *
     * Creates a router with the model's methods mounted on {inName}/...
     */
    public CreateHistoryRoute(inName: string, inModel: HistoryModel, expire?: number | string) {
        const historyRouter = new HistoryRouter(inModel);
        historyRouter.initRoutes(expire);
        this.router.use(inName, historyRouter.router);
    }

    /**
     *
     * @param inData Array with data about the new created routes, contains object with name
     * (specifies where the routes will be available)
     * and schema (format of the data to be returned at the routes).
     *
     * Binds all routes passed as parameter to /{their name}
     */
    public CreateGeojsonRoutes(inData: IDatasetDefinition[]) {
        inData.forEach((data) => {
            this.CreateGeojsonRoute(
                "/" + data.name.toLowerCase(),
                new GeoJsonModel(data.name, data.schema, data.collectionName),
            );
        });
    }

    /**
     *
     * @param inData Array with data about the new created routes
     * if it contains a "history" sub-object, this creates a route for that
     *
     * Binds history route passed as parameter to /{their name}/history
     */
    public CreateHistoryRoutes(inData: IDatasetDefinition[]) {
        inData.forEach((data) => {
            if (data.history) {
                this.CreateHistoryRoute(
                    "/" + data.name.toLowerCase() + "/history",
                    new HistoryModel(data.history.name, data.history.schema, data.history.collectionName,
                        data.history.historyTimePropertyLocation),
                );
            }
        });
    }

    /**
     * Loads the data for building the routes
     */
    public LoadData(inData: IDatasetDefinition[]) {
        log.silly(`RouterBuilder: Loaded data to build ${inData.length} sets of routes`);
        if (this.routesData && this.routesData.length >= 0) {
            log.warn("Routes data were not empty. Rewriting with new set of data. All previous will be lost.");
        }
        this.routesData = inData;
    }

    /**
     * Builds all routes based on data in this.data and mounts them to this.router
     */
    public BuildAllRoutes() {
        if (!this.routesData || this.routesData.length === 0) {
            log.warn("Routes data for building routes seem to be empty."
                + "Make sure to call .LoadData before you .BuildAllRoutes");
            log.debug(this.routesData);
        }
        this.CreateHistoryRoutes(this.routesData);
        this.CreateGeojsonRoutes(this.routesData);
    }
}
