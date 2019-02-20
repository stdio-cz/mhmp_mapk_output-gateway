"use strict";

import "mocha";
const config = require("../../src/config/config");

const express = require("express");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const request = require("supertest");
import log from "../../src/helpers/Logger";

import ParkingZonesRouter from "../../src/routes/ParkingZonesRouter";

const expect = chai.expect;
chai.use(chaiAsPromised);

describe("ParkingZonesRouter", () => {
    const app = express();
    let parkingZoneCode: string;

    before(() => {
        parkingZoneCode = "P4-0265";
        app.use("/parkingzones", ParkingZonesRouter);
    });

    it("should respond with json to GET /parkingzones", (done) => {
        request(app)
          .get("/parkingzones")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });

    it("should respond with GeoJson FeatureCollection to GET /parkingzones", (done) => {
        request(app)
          .get("/parkingzones").end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an.instanceOf(Object);
              expect(res.body.features).to.be.an.instanceOf(Array);
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it("should respond with json to GET /parkingzones/:code ", (done) => {
        request(app)
          .get("/parkingzones/" + parkingZoneCode)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });

    it("should respond with parking zone object to GET /parkingzones/:code ", (done) => {
        request(app)
          .get("/parkingzones/" + parkingZoneCode).end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.properties.code).to.be.equal(parkingZoneCode);
              expect(res.body.properties.payment_link).to.be.a("string");
              done();
          });
    });

    it("should respond with json to GET /parkingzones/:code/tariffs ", (done) => {
        request(app)
          .get("/parkingzones/" + parkingZoneCode + "/tariffs")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });
});
