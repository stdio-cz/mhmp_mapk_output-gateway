"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const request = require("supertest");
const express = require("express");

import VehiclePositionsRouter from "../../src/routes/VehiclePositionsRouter";

chai.use(chaiAsPromised);

// describe("VehiclePositionsRouter", () => {
//     // Create clean express instance
//     const app = express();

//     before(() => {
//         // Mount the tested router to the express instance
//         app.use("/vehiclepositions", VehiclePositionsRouter);
//         TODO
//     });

// });
