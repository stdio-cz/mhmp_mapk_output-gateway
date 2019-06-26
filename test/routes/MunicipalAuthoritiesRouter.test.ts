"use strict";

import * as express from "express";
import "mocha";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as request from "supertest";
import * as sinon from "sinon";
import { log } from "../../src/core/Logger";
const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;
import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import { handleError } from "../../src/core/errors";
import { municipalAuthoritiesRouter } from "../../src/resources/municipalauthorities/MunicipalAuthoritiesRouter";

chai.use(chaiAsPromised);

describe("MunicipalAuthorities Router", () => {
    const municipalAuthority = "skoduv-palac";
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
        app.use("/municipalauthorities", municipalAuthoritiesRouter);
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

    it("should respond with json to GET /municipalauthorities", (done) => {
        request(app)
            .get("/municipalauthorities")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /municipalauthorities?type=Feature", (done) => {
        request(app)
            .get("/municipalauthorities?type=Feature")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /municipalauthorities/:id/queues", (done) => {
        request(app)
            .get("/municipalauthorities/" + municipalAuthority + "/queues")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
