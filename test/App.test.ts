"use strict";

import * as express from "express";
import "mocha";
import * as sinon from "sinon";
import App from "../src/App";
import config from "../src/config/config";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as request from "supertest";

chai.use(chaiAsPromised);

describe("App", () => {

    const app: express.Application = express();
    let sandbox: any;
    let exitStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox({ useFakeTimers: true });
        exitStub = sandbox.stub(process, "exit");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should start", async () => {
        expect(app).not.to.be.undefined;
    });

    it("should have all config variables set", () => {
        expect(config).not.to.be.undefined;
        expect(config.mongo_connection).not.to.be.undefined;
    });

    it("should have health check on /", () => {
        request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it("should have health check on /health-check", () => {
        request(app)
            .get("/health-check")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);
    });

    it("should return 404 on non-existing route /non-existing", () => {
        request(app)
            .get("/non-existing")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404);
    });

    it("should respond with 400 BAD REQUEST to GET /parkings/?latlng&range with bad parameters", () => {
        request(app)
            .get("/parkings/?latlng=50.032074,14.492015&range=asd")
            .expect(400);
    });
});
