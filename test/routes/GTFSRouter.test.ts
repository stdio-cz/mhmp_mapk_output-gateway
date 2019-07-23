"use strict";

import "mocha";

import { expect } from "chai";
import * as express from "express";
import { NextFunction, Request, Response } from "express";

const config = require("../../src/config/config");

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import * as request from "supertest";

import { handleError } from "../../src/core/errors";
import { log } from "../../src/core/Logger";
import { gtfsRouter } from "../../src/resources/gtfs/GTFSRouter";

chai.use(chaiAsPromised);

describe("GTFS Router", () => {
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
        app.use("/gtfs", gtfsRouter);
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

    it("should respond with json to GET /gtfs/trips ", (done) => {
        request(app)
            .get("/gtfs/trips")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with list of trips to GET /gtfs/trips", (done) => {
        request(app)
            .get("/gtfs/trips").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should respond with detail of trip to GET /gtfs/trips/{id}", (done) => {
        request(app)
            .get("/gtfs/trips/991_30_190107").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=20&offset=ahoj", (done) => {
        request(app)
            .get("/gtfs/trips?limit=20&offset=ahoj").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=ahoj&offset=1", (done) => {
        request(app)
            .get("/gtfs/trips?limit=ahoj&offset=1").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=20&offset=2", (done) => {
        request(app)
            .get("/gtfs/trips?limit=20&offset=2").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should respond with routes going through stop ID U953Z102P GET /gtfs/trips?stop_id=U953Z102P", (done) => {
        request(app)
            .get("/gtfs/trips?stop_id=U953Z102P").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should respond with routes for specific date GET /gtfs/trips?date=2019-05-27", (done) => {
        request(app)
            .get("/gtfs/trips?date=2019-05-27").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should respond with json to GET /gtfs/stops ", (done) => {
        request(app)
            .get("/gtfs/stops")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("object");
                expect(res.body.features).to.be.an("array");
                expect(res.body.type).to.be.equal("FeatureCollection");
                done();
            });
    });

    it("should respond with 400 to GET /gtfs/stops?latlng (wrong query param)", (done) => {
        request(app)
            .get("/gtfs/stops?latlng=50.1154814.43732").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    });

    it("should respond with 200 to GET /gtfs/stoptimes/:stop_id", (done) => {
        request(app)
            .get("/gtfs/stoptimes/U118Z102P").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("should respond with 400 to GET /gtfs/stoptimes/:stop_id incorrect filters", (done) => {
        request(app)
            .get("/gtfs/stoptimes/U118Z102P?from=13:22:11&to=12:12:12").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                expect(res.body.cause).to.have.property("from", "'to' cannot be later than 'from'");
                done();
            });
    });

    it("should respond with 200 to GET /gtfs/routes ", (done) => {
        request(app)
            .get("/gtfs/routes").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("should respond with 404 to GET /gtfs/routes/:routeId ", (done) => {
        request(app)
            .get("/gtfs/routes/L991aaaaaaaaaa").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 404 to GET /gtfs/shapes/:shapeId ", (done) => {
        request(app)
            .get("/gtfs/shapes/asdh").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 200 to GET /gtfs/services ", (done) => {
        request(app)
            .get("/gtfs/services").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });

    it("should respond with 200 to GET /gtfs/services?date=2019-02-28 ", (done) => {
        request(app)
            .get("/gtfs/services?date=2019-02-28").end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });
});
