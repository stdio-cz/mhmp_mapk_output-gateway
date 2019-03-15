"use strict";

import "mocha";

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
import VehiclePositionsRouter from "../../src/routes/VehiclePositionsRouter";

const expect = chai.expect;

chai.use(chaiAsPromised);

describe("VehiclePositions Router", () => {
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
        [],
        {logging: false},
    );

    before(() => {
        // Mount the tested router to the express instance
        app.use("/vehiclepositions", VehiclePositionsRouter);
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

    // TODO - no distinct on in sqlite
    // it("should respond with json to GET /vehiclepositions", (done) => {
    //     request(app)
    //         .get("/vehiclepositions")
    //         .set("Accept", "application/json")
    //         .expect("Content-Type", /json/)
    //         .expect(200, done);
    // });
    //
    // it("should respond with list of trips to GET /vehiclepositions", (done) => {
    //     request(app)
    //         .get("/vehiclepositions")
    //         .end((err: any, res: any) => {
    //             expect(res.statusCode).to.be.equal(200);
    //             expect(res.body).to.be.an("object");
    //             expect(res.body.features).to.be.an("array");
    //             expect(res.body.type).to.be.equal("FeatureCollection");
    //             done();
    //         });
    // });
});
