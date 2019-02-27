"use strict";

import "mocha";

const config = require("../../src/config/config");

const chai = require("chai");
const express = require("express");
const chaiAsPromised = require("chai-as-promised");
const request = require("supertest");

import log from "../../src/helpers/Logger";
// const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

// import * as path from "path";
// import {PostgresDatabase} from "../../src/helpers/PostgreDatabase";
import handleError from "../../src/helpers/errors/ErrorHandler";
import GTFSRouter from "../../src/routes/GTFSRouter";

const expect = chai.expect;

chai.use(chaiAsPromised);

describe("GTFS Router", () => {
    // Create clean express instance
    const app = express();

    // // Basic configuration: create a sinon sandbox for testing
    // let sandbox: any = null;
    //
    // beforeEach(() => {
    //     sandbox = sinon.sandbox.create();
    // });
    //
    // afterEach(() => {
    //     sandbox && sandbox.restore();
    // });
    //
    // // Load fake data for the users
    // sequelizeMockingMocha(
    //     PostgresDatabase,
    //     path.resolve(path.join(__dirname, "./fake-users-database.json")),
    //     /* Or load array of files
    //     [
    //         path.resolve(path.join(__dirname, './fake-users-database.json')),
    //         path.resolve(path.join(__dirname, './fake-candy-database.json')),
    //     ]
    //     */
    //     {logging: false},
    // );

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

    it("should respond with detail of trip to GET /gtfs/trips/{id} (not an id)", (done) => {
        request(app)
            .get("/gtfs/trips/fksdlfj").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(400);
            done();
        });
    });

    it("should respond with detail of trip to GET /gtfs/trips/{id}", (done) => {
        request(app)
            .get("/gtfs/trips/1").end((err: any, res: any) => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.body).to.be.an("object");
            done();
        });
    });
});
