"use strict";

import "mocha";
import * as path from "path";
import {models} from "../../src/models";
import {VehiclePositionsModel} from "../../src/models/VehiclePositionsModel";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

const sequelize = require("../../src/helpers/PostgreDatabase").default;

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("VehiclePositionsModel", () => {

    const vehiclepositionsModel: VehiclePositionsModel = models.VehiclePositionsModel;

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

    // TODO - no distinct on in sqlite
    // it("should return all items", async () => {
    //     const result = await vehiclepositionsModel.GetAll();
    //     expect(result).to.be.an.instanceOf(Array).and.lengthOf(0);
    // });
});
