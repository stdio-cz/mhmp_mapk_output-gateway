"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const express = require("express");
const chaiAsPromised = require("chai-as-promised");
const request = require("supertest");
import log from "../../src/helpers/Logger";

import ParkingsRouter from "../../src/routes/ParkingsRouter";

const expect = chai.expect;

chai.use(chaiAsPromised);

describe("ParkingsRouter", () => {
    // Create clean express instance
    const app = express();
    let parkingId: number;

    before(() => {
        // Mount the tested router to the express instance
        app.use("/parkings", ParkingsRouter);
        parkingId = 534017;
    });

    it("should respond with json to GET /parkings ", (done) => {
        request(app)
          .get("/parkings")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });

    it("should respond with GeoJson FeatureCollection to GET /parkings ", (done) => {
        request(app)
          .get("/parkings").end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.features).to.be.an("array");
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it("should respond with GeoJson FeatureCollection to GET /parkings/?latlng ", (done) => {
        request(app)
          .get("/parkings/?latlng=50.11548,14.43732").end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.features).to.be.an("array");
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it("should respond with GeoJson FeatureCollection to GET /parkings/?latlng=&ids=&districts", (done) => {
        request(app)
          .get("/parkings/?latlng=50.11548,14.43732&ids=534017&districts=praha-11").end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.features).to.be.an("array");
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it("should respond with error to GET /parkings/?latlng with bad parameters", (done) => {
        request(app)
          .get("/parkings/?latlng=50.11548N,14.43732asdasd").end((err: any, res: any) => {
              expect(err).not.to.be.undefined;
              done();
          });
    });

    it("should respond with json to GET /parkings/:Id ", (done) => {
        request(app)
          .get("/parkings/" + parkingId)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200, done);
    });

    it("should respond with parking object to GET /parkings/:Id ", (done) => {
        request(app)
          .get("/parkings/" + parkingId).end((err: any, res: any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an("object");
              expect(res.body.properties.id).to.be.equal(parkingId);
              expect(res.body.properties.num_of_free_places).to.be.a("number");
              done();
          });
    });
});
