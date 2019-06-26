"use strict";

import * as express from "express";
import "mocha";
import * as sinon from "sinon";
import { generalRoutes } from "../../src/App";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as request from "supertest";
import { log } from "../../src/core/Logger";
import { RouterBuilder, IDatasetDefinition } from "../../src/core/routes/RouterBuilder";

chai.use(chaiAsPromised);

describe("RouterBuilder", () => {

    const app: express.Application = express();
    const defaultRouter = express.Router();

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    let routerBuilder: RouterBuilder;

    before(() => {
        sandbox = sinon.createSandbox();

        app.use("/", defaultRouter);
        routerBuilder = new RouterBuilder(defaultRouter);
        routerBuilder.LoadData(generalRoutes);
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

    it("should respond with json to GET for all generic routes", async () => {
        const promises: request.Test[] = generalRoutes.map(x => {
            const endpoint = "/" + x.name.toLowerCase();
            return request(app)
                .get(endpoint)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200);
        });
        await Promise.all(promises);
    });
});
