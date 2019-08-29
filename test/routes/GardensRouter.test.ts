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
import { gardensRouter } from "../../src/resources/gardens/GardensRouter";

chai.use(chaiAsPromised);

describe("Gardens Router", () => {
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
        app.use("/gardens", gardensRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with json to GET /gardens", (done) => {
        request(app)
            .get("/gardens")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /gardens/properties", (done) => {
        request(app)
            .get("/gardens/properties")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
