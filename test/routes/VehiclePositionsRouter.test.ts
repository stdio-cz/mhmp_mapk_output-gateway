"use strict";

import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/errors";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import "mocha";
import * as sinon from "sinon";
import * as request from "supertest";
import { log } from "../../src/core/Logger";
import { vehiclepositionsRouter } from "../../src/resources/vehiclepositions/VehiclePositionsRouter";

chai.use(chaiAsPromised);
const fs = require("fs");

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
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with json to GET /vehiclepositions", (done) => {
        request(app)
            .get("/vehiclepositions")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with protobuffer to GET /vehiclepositions/gtfsrt/trip_updates.pb", (done) => {
        request(app)
            .get("/vehiclepositions/gtfsrt/trip_updates.pb")
            .set("Accept", "application/octet-stream")
            .expect("Content-Type", /octet-stream/)
            .expect(200)
            .end((err, data) => {
                if (err) {
                    return done(err);
                }
                fs.readFile("./db/example/trip_updates.pb", (readerr: Error, rawdata: any) => {
                    if (readerr) {
                        return done(readerr);
                    }
                    chai.expect(data.body).to.deep.equal(rawdata);
                    done();
                });
            });
    });

    it("should respond with protobuffer to GET /vehiclepositions/gtfsrt/vehicle_positions.pb", (done) => {
        request(app)
            .get("/vehiclepositions/gtfsrt/vehicle_positions.pb")
            .set("Accept", "application/octet-stream")
            .expect("Content-Type", /octet-stream/)
            .expect(200)
            .end((err, data) => {
                if (err) {
                    return done(err);
                }
                fs.readFile("./db/example/vehicle_positions.pb", (readerr: Error, rawdata: any) => {
                    if (readerr) {
                        return done(readerr);
                    }
                    chai.expect(data.body).to.deep.equal(rawdata);
                    done();
                });
            });

    });
});
