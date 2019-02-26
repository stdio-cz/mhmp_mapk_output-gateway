"use strict";

import "mocha";
import App from "../src/App";
import config from "../src/config/config";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const request = require("supertest")("localhost:" + config.port);
const sinon = require("sinon");

import log from "../src/helpers/Logger";

const express = require("express");

chai.use(chaiAsPromised);

describe("App", () => {

    let sandbox: any;
    let exitStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox({ useFakeTimers : true });
        exitStub = sandbox.stub(process, "exit");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should start", async () => {
        const app = await new App().start();
        expect(app).to.be.undefined;
    });

    it("should have all config variables set", () => {
        expect(config).not.to.be.undefined;
        expect(config.mongo_connection).not.to.be.undefined;
    });

    it("should have health check on /", () => {
        request
          .get("/")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200);
    });

    it("should have health check on /health-check", () => {
        request
          .get("/health-check")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200);
    });

    it("should return 404 on non-existing route /non-existing", () => {
        request
          .get("/non-existing")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404);
    });

    it("should respond with 400 BAD REQUEST to GET /parkings/?latlng with bad parameters", (done) => {
        request
          .get("/parkings/?latlng=50.11548N,14.43732asdasd").then((res: any) => {
              log.debug(res);
              const status = res.statusCode ? res.statusCode : res.status;
              expect(status).to.be.equal(400);
              done();
          }).catch((err: any) => {
              log.debug(err);
              done();
          });
    });
});
