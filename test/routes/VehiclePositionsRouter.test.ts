"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const request = require('supertest');
const express = require('express');

import VehiclePositionsRouter from "../../src/routes/VehiclePositionsRouter";

chai.use(chaiAsPromised);


// describe("VehiclePositionsRouter", () => {
//     // Create clean express instance
//     const app = express();

//     before(() => {
//         // Mount the tested router to the express instance
//         app.use("/vehiclepositions", VehiclePositionsRouter);
//     });

//     it('should respond with json to GET /vehiclepositions ', function(done) {
//         request(app)
//           .get('/vehiclepositions')
//           .set('Accept', 'application/json')
//           .expect('Content-Type', /json/)
//           .expect(200, done);
//     });

//     it('should respond with GeoJson FeatureCollection to GET /vehiclepositions ', function(done) {
//         request(app)
//           .get('/vehiclepositions').end((err:any, res:any) => {
//               expect(res.statusCode).to.be.equal(200);
//               expect(res.body).to.be.an('object');
//               expect(res.body.features).to.be.an('array');
//               expect(res.body.type).to.be.equal("FeatureCollection");
//               done();
//           });
//     });

//     it('should respond with GeoJson FeatureCollection to GET /vehiclepositions/?latlng ', function(done) {
//         request(app)
//           .get('/vehiclepositions/?latlng=50.11548,14.43732').end((err:any, res:any) => {
//               expect(res.statusCode).to.be.equal(200);
//               expect(res.body).to.be.an('object');
//               expect(res.body.features).to.be.an('array');
//               expect(res.body.type).to.be.equal("FeatureCollection");
//               done();
//           });
//     });

//     it('should respond with json to GET /vehiclepositions/:Id ', function(done) {
//         request(app)
//           .get('/vehiclepositions/1')
//           .set('Accept', 'application/json')
//           .expect('Content-Type', /json/)
//           .expect(200, done);
//     });

//     it('should respond with parking object to GET /vehiclepositions/:Id ', function(done) {
//         request(app)
//           .get('/vehiclepositions/1').end((err:any, res:any) => {
//               expect(res.statusCode).to.be.equal(200);
//               expect(res.body).to.be.an('object');
//               done();
//           });
//     });

// });