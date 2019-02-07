"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const request = require('supertest');
const express = require('express');
import log from "../../src/helpers/Logger";

import ParkingsRouter from "../../src/routes/ParkingsRouter";

chai.use(chaiAsPromised);


describe("ParkingsRouter", () => {
    // Create clean express instance
    const app = express();
    let parkingId: Number;

    before(() => {
        // Mount the tested router to the express instance
        app.use("/parkings", ParkingsRouter);
        parkingId = 534017;
    });

    it('should respond with json to GET /parkings ', function(done) {
        request(app)
          .get('/parkings')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('should respond with GeoJson FeatureCollection to GET /parkings ', function(done) {
        request(app)
          .get('/parkings').end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.features).to.be.an('array');
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it('should respond with GeoJson FeatureCollection to GET /parkings/?latlng ', function(done) {
        request(app)
          .get('/parkings/?latlng=50.11548,14.43732').end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.features).to.be.an('array');
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it('should respond with GeoJson FeatureCollection to GET /parkings/?latlng=50.11548,14.43732&ids=534017&districts=praha-11 ', function(done) {
        request(app)
          .get('/parkings/?latlng=50.11548,14.43732&ids=534017&districts=praha-11').end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.features).to.be.an('array');
              expect(res.body.type).to.be.equal("FeatureCollection");
              done();
          });
    });

    it('should respond with error to GET /parkings/?latlng with bad parameters', function(done) {
        request(app)
          .get('/parkings/?latlng=50.11548N,14.43732asdasd').end((err:any, res:any) => {
              expect(err).not.to.be.equal(undefined);
              done();
          });
    });

    it('should respond with json to GET /parkings/:Id ', function(done) {
        request(app)
          .get('/parkings/' + parkingId)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
    });

    it('should respond with parking object to GET /parkings/:Id ', function(done) {
        request(app)
          .get('/parkings/' + parkingId).end((err:any, res:any) => {
              expect(res.statusCode).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.properties.id).to.be.equal(parkingId);
              expect(res.body.properties.num_of_free_places).to.be.a('number');
              done();
          });
    });

});