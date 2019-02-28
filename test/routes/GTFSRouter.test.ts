"use strict";

import "mocha";

const config = require("../../src/config/config");

const chai = require("chai");
const sinon = require("sinon");
const express = require("express");
const request = require("supertest");
const chaiAsPromised = require("chai-as-promised");
const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;
const sequelize = require("../../src/helpers/PostgreDatabase").default;

import log from "../../src/helpers/Logger";

import * as path from "path";
import handleError from "../../src/helpers/errors/ErrorHandler";
import GTFSRouter from "../../src/routes/GTFSRouter";

const expect = chai.expect;

chai.use(chaiAsPromised);

describe("GTFS Router", () => {
    // Create clean express instance
    const app = express();
    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_trips.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stop_times.json")),
        ],
        {logging: false},
    );

    before(() => {
        // Mount the tested router to the express instance
        app.use("/gtfs", GTFSRouter);
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
            expect(res.body).to.be.an("object");
            expect(res.body.features).to.be.an("array");
            expect(res.body.type).to.be.equal("FeatureCollection");
            done();
        });
    });

    it("should respond with detail of trip to GET /gtfs/trips/{id}", (done) => {
        request(app)
            .get("/gtfs/trips/991_30_190107").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            done();
        });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=20&page=2", (done) => {
        request(app)
            .get("/gtfs/trips?limit=20&offset=10").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.features).to.be.an("array").and.lengthOf(20);
            expect(res.body.type).to.be.equal("FeatureCollection");
            done();
        });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=20&page=2", (done) => {
        request(app)
            .get("/gtfs/trips?limit=20&offset=10").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.features).to.be.an("array").and.lengthOf(20);
            expect(res.body.type).to.be.equal("FeatureCollection");
            done();
        });
    });

    it("should respond with paginated list GET /gtfs/trips?limit=20&page=2", (done) => {
        request(app)
            .get("/gtfs/trips?limit=20&offset=10").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.features).to.be.an("array").and.lengthOf(20);
            expect(res.body.type).to.be.equal("FeatureCollection");
            done();
        });
    });

    it("should respond with routes going through stop ID U953Z102P GET /gtfs/trips?stop_id=U953Z102P", (done) => {
        request(app)
            .get("/gtfs/trips?stop_id=U953Z102P").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            expect(res.body.features).to.be.an("array").and.lengthOf(7);
            expect(res.body.type).to.be.equal("FeatureCollection");
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
});
