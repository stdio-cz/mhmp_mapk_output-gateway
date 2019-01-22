"use strict";

import "mocha";
const config = require("../../src/config/config");
import MongoDatabase from "../../src/helpers/MongoDatabase";
import handleError from "../../src/helpers/errors/ErrorHandler";
const { sequelizeConnection } = require("../../src/helpers/PostgreDatabase");
import { VehiclePositionsModel } from "../../src/models";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import log from "../../src/helpers/Logger";

chai.use(chaiAsPromised);

// describe("VehiclePositionsModel", () => {

//     let model: VehiclePositionsModel;
//     let parkingZoneCode: String;
//     let coordinates: Array<number>;

//     before(async () => {
//         await sequelizeConnection;
//         model = new VehiclePositionsModel();
//     });

//     it("should instantiate", () => {
//         expect(model).not.to.be.undefined;
//     });

//     it("should not fail trying to create the same model again", () => {
//         const model2 = new VehiclePositionsModel();
//         expect(model).not.to.be.undefined;
//     });

//     it("should have GetAll method", () => {
//         expect(model.GetAll).not.to.be.undefined;
//     });

//     it("should return fulfilled promise to GetAll call", async () => {
//         const promise = model.GetAll();
//         expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
//         await expect(promise).to.be.fulfilled;
//     });

//     it("should return all records as GeoJson FeatureCollection", async () => {
//         const data = await model.GetAll();
//         expect(data).to.be.an.instanceOf(Object);
//         expect(data.features).to.be.an.instanceOf(Array);
//         expect(data.type).to.be.equal("FeatureCollection");
//     });

// });
