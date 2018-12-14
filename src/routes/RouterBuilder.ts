import { Router } from "express";
import { GeoJsonModel } from "../models";
import { GeoJsonRouter } from ".";
import { SchemaDefinition } from "mongoose";
import { Parkings } from "data-platform-schema-definitions";
import { IceGatewaySensors } from "data-platform-schema-definitions";
import { IceGatewayStreetLamps } from "data-platform-schema-definitions";

"use strict";


let data = [
    {
        collectionName: IceGatewayStreetLamps.mongoCollectionName,
        name: IceGatewayStreetLamps.name,
        schema: IceGatewayStreetLamps.outputMongooseSchemaObject
    },
    {
        collectionName: IceGatewaySensors.mongoCollectionName,
        name: IceGatewaySensors.name,
        schema: IceGatewaySensors.outputMongooseSchemaObject
    },
    {
        name: "city-districts",
        collectionName: "city_districts",
        schema: {
            geometry: {
                coordinates: { type: Array },
                type: { type: String },
            },
            properties: {
                id: { type: Number, required: true },
                name: { type: String, required: true },
                slug: { type: String, required: true },
                timestamp: { type: Number, required: true },
            },
            type: { type: String, required: true}
        }        
    },
];

/**
 * General router builder. Creates routes on top of passed Express router 
 * based on data about desired routes - their type, name (base url) and schema of the data to be returned
 * 
 * For GeoJSON data, automatically creates / and /:id routes, adds filtering parameters (geo, city district, limit, offset, last updated)
 */
export default class RouterBuilder {
    private router: Router;

    constructor (inRouter: Router){
        this.router = inRouter;
    }

    /**
     * 
     * @param inName Name of the route, serves as base url for the route's requests {base router}/{inName}/
     * @param inModel Model whose methods are to be mounted on the routes
     * 
     * Creates a router with the model's methods mounted on {inName}/ and {inName}/:id
     */
    public CreateGeojsonRoute (inName: string, inModel: GeoJsonModel){
        this.router.use(inName, new GeoJsonRouter(inModel).router);
    }

    /**
     * 
     * @param inData Array with data about the new created routes, contains object with name (specifies where the routes will be available)
     * and schema (format of the data to be returned at the routes)
     */
    public CreateGeojsonRoutes (inData: Array<{name:string, schema: SchemaDefinition, collectionName:string}>){
        inData.forEach((data) => {
            this.CreateGeojsonRoute("/" + data.name.toLowerCase(), new GeoJsonModel(data.name, data.schema, data.collectionName));
        });
    }

    public BuildAllRoutes(){
        this.CreateGeojsonRoutes(data);
    }
}