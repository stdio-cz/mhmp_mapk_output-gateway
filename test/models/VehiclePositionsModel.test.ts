"use strict";

import "mocha";
import * as path from "path";
import { models } from "../../src/resources/vehiclepositions/models";
import { VehiclePositionsTripsModel } from "../../src/resources/vehiclepositions/models/VehiclePositionsTripsModel";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import { sequelizeConnection as sequelize} from "../../src/core/database/PostgreDatabase";

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("VehiclePositionsTripsModel", () => {

    const vehiclepositionsModel: VehiclePositionsTripsModel = models.VehiclePositionsTripsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(vehiclepositionsModel).not.to.be.undefined;
    });

    // TODO - sqlite cannot process date functions correctly
    // it("should return all items", async () => {
    //     const result = await vehiclepositionsModel.GetAll();
    //     expect(result).to.be.an.instanceOf(Array).and.lengthOf(0);
    // });
});
