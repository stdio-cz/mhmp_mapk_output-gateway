"use strict";

import * as express from "express";
import { NextFunction, Request, Response } from "express";
import "mocha";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as request from "supertest";
import { log } from "../../src/core/Logger";

import { handleError } from "golemio-errors";
import * as sinon from "sinon";
import { vehiclepositionsRouter } from "../../src/resources/vehiclepositions/VehiclePositionsRouter";

chai.use(chaiAsPromised);

describe("VehiclePositions Router", () => {
    // Create clean express instance
    const app = express();
    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    before(() => {
        // Mount the tested router to the express instance
        app.use("/vehiclepositions", vehiclepositionsRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            handleError(err).then((error) => {
                if (error) {
                    log.silly("Error caught by the router error handler.");
                    res.setHeader("Content-Type", "application/json; charset=utf-8");
                    res.status(error.error_status || 500).send(error);
                }
            });
        });
    });

    it("should respond with json to GET /vehiclepositions", (done) => {
        request(app)
            .get("/vehiclepositions")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
