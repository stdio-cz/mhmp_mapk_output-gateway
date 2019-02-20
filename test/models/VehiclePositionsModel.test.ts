"use strict";

import "mocha";
const config = require("../../src/config/config");
import handleError from "../../src/helpers/errors/ErrorHandler";
import MongoDatabase from "../../src/helpers/MongoDatabase";
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
//         TODO
//     });

//     it("should instantiate", () => {
//         expect(model).not.to.be.undefined;
//     });

// });
