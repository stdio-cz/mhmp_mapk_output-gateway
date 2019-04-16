import { Router } from "express";
import { CityDistricts,
    IceGatewaySensors,
    IceGatewayStreetLamps,
    Parkings,
    SharedCars } from "golemio-schema-definitions";
import { SchemaDefinition } from "mongoose";
import { GeoJsonRouter } from ".";
import { GeoJsonModel } from "../models";

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
    private routesData: Array<{name: string, schema: SchemaDefinition, collectionName: string}>;

    constructor(inRouter: Router) {
        this.router = inRouter;
        this.routesData = [
            {
                collectionName: IceGatewayStreetLamps.mongoCollectionName,
                name: IceGatewayStreetLamps.name,
                schema: IceGatewayStreetLamps.outputMongooseSchemaObject,
            },
            {
                collectionName: IceGatewaySensors.mongoCollectionName,
                name: IceGatewaySensors.name,
                schema: IceGatewaySensors.outputMongooseSchemaObject,
            },
            {
                collectionName: SharedCars.mongoCollectionName,
                name: SharedCars.name,
                schema: SharedCars.outputMongooseSchemaObject,
            },
        ];
    }

    /**
     *
     * @param inName Name of the route, serves as base url for the route's requests {base router}/{inName}/
     * @param inModel Model whose methods are to be mounted on the routes
     *
     * Creates a router with the model's methods mounted on {inName}/ and {inName}/:id
     */
    public CreateGeojsonRoute(inName: string, inModel: GeoJsonModel) {
        const generalRouter = new GeoJsonRouter(inModel);
        generalRouter.initRoutes();
        this.router.use(inName, generalRouter.router);
    }

    /**
     *
     * @param inData Array with data about the new created routes, contains object with name
     * (specifies where the routes will be available)
     * and schema (format of the data to be returned at the routes).
     *
     * Binds routes to /{name}
     */
    public CreateGeojsonRoutes(inData: Array<{name: string, schema: SchemaDefinition, collectionName: string}>) {
        inData.forEach((data) => {
            this.CreateGeojsonRoute("/" + data.name.toLowerCase(),
                                    new GeoJsonModel(data.name, data.schema, data.collectionName),
                                );
        });
    }

    /**
     * Builds all routes based on data in this.data and mouts them to this.router
     */
    public BuildAllRoutes() {
        this.CreateGeojsonRoutes(this.routesData);
    }
}
