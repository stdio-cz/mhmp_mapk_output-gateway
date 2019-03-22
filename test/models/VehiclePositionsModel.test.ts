"use strict";

import "mocha";
import * as path from "path";
import {models} from "../../src/models";
import {VehiclePositionsTripsModel} from "../../src/models/VehiclePositionsTripsModel";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

const sequelize = require("../../src/helpers/PostgreDatabase").default;

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
        sandbox = sinon.sandbox.create();
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
