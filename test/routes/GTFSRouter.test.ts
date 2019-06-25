"use strict";

import "mocha";

import * as express from "express";
import * as config from "../../src/config/config";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as request from "supertest";
import * as chaiAsPromised from "chai-as-promised";
const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;
import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import { log } from "../../src/core/Logger";
import { handleError } from "../../src/core/errors";
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

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [],
        { logging: false },
    );

    before(() => {
        // Mount the tested router to the express instance
        app.use("/gtfs", gtfsRouter);
        app.use((err: any, req: any, res: any, next: any) => {
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

    it("should respond with routes for specific day GET /gtfs/trips?day=U953Z102P", (done) => {
        request(app)
            .get("/gtfs/trips?stop_id=U953Z102P").end((err: any, res: any) => {
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
            .get("/gtfs/routes/L991").end((err: any, res: any) => {
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
            .get("/gtfs/services?date=20190228").end((err: any, res: any) => {
                console.log('haaaa');
                console.log(err);
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.instanceOf(Array);
                done();
            });
    });
});
