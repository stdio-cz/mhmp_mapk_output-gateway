"use strict";

import "mocha";
const config = require("../../src/config/config");
const sinon = require("sinon");
import * as express from "express";
const request = require("supertest");
import { RouterBuilder, IDatasetDefinition } from "../../src/core/routes/RouterBuilder";
import { IceGatewayStreetLamps } from "golemio-schema-definitions";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import { log } from "../../src/core/Logger";

chai.use(chaiAsPromised);

describe("RouterBuilder", () => {

    const testLoadData: IDatasetDefinition[] = [
        {
            collectionName: IceGatewayStreetLamps.mongoCollectionName,
            name: IceGatewayStreetLamps.name,
            schema: IceGatewayStreetLamps.outputMongooseSchemaObject,
        }
    ];

    const app: express.Application = express();
    const defaultRouter = express.Router();

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    let routerBuilder: RouterBuilder;

    before(() => {
        sandbox = sinon.createSandbox();

        app.use("/", defaultRouter);
        routerBuilder = new RouterBuilder(defaultRouter);
        routerBuilder.LoadData(testLoadData);
        routerBuilder.BuildAllRoutes();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(routerBuilder).not.to.be.undefined;
    });

    it("should have CreateGeojsonRoute method", () => {
        expect(routerBuilder.CreateGeojsonRoute).not.to.be.undefined;
    });

    it("should have CreateHistoryRoute method", () => {
        expect(routerBuilder.CreateHistoryRoute).not.to.be.undefined;
    });

    it("should have CreateGeojsonRoutes method", () => {
        expect(routerBuilder.CreateGeojsonRoutes).not.to.be.undefined;
    });

    it("should have CreateHistoryRoutes method", () => {
        expect(routerBuilder.CreateHistoryRoutes).not.to.be.undefined;
    });

    it("should have LoadData method", () => {
        expect(routerBuilder.LoadData).not.to.be.undefined;
    });

    it("should have BuildAllRoutes method", () => {
        expect(routerBuilder.BuildAllRoutes).not.to.be.undefined;
    });

    it("should respond with json to GET for all generic routes", (done) => {
        testLoadData.forEach((x: IDatasetDefinition) => {
            request(app)
                .get("/" + x.name.toLowerCase())
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200, done)
        });
    });
});
