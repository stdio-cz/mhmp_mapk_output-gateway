"use strict";

import * as express from "express";
import "mocha";

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as request from "supertest";
import { log } from "../../src/core/Logger";

import { handleError } from "golemio-errors";
import * as sinon from "sinon";
import { medicalInstitutionsRouter } from "../../src/resources/medicalinstitutions/MedicalInstitutionsRouter";

chai.use(chaiAsPromised);

describe("MedicalInstitutions Router", () => {
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
        app.use("/medicalinstitutions", medicalInstitutionsRouter);
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

    it("should respond with json to GET /medicalinstitutions", (done) => {
        request(app)
            .get("/medicalinstitutions")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /medicalinstitutions?group=email", (done) => {
        request(app)
            .get("/medicalinstitutions?group=email")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /medicalinstitutions/types", (done) => {
        request(app)
            .get("/medicalinstitutions/types")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
