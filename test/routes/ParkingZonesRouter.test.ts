"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const request = require('supertest');
const express = require('express');
import log from "../../src/helpers/Logger";

import ParkingZonesRouter from "../../src/routes/ParkingZonesRouter";

chai.use(chaiAsPromised);


describe("ParkingZonesRouter", () => {
    const app = express();
    let parkingZoneCode: String;

    before(() => {
        parkingZoneCode = "P8-2023";
        app.use("/parkingzones", ParkingZonesRouter);
    });

    it('should respond with json to GET /parkingzones ', function(done) {
        request(app)
          .get('/parkingzones')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('should respond with GeoJson FeatureCollection to GET /parkingzones', function(done) {
        request(app)
          .get('/parkingzones').end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an.instanceOf(Object);
              expect(res.body.features).to.be.an.instanceOf(Array);
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it('should respond with json to GET /parkingzones/:code ', function(done) {
        request(app)
          .get('/parkingzones/' + parkingZoneCode)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('should respond with parking zone object to GET /parkingzones/:code ', function(done) {
        request(app)
          .get('/parkingzones/' + parkingZoneCode).end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.properties.code).to.be.equal(parkingZoneCode);
              expect(res.body.properties.payment_link).to.be.a('string');
              done();
          });
    });

});