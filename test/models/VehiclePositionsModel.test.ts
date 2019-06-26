"use strict";

import "mocha";
import { models } from "../../src/resources/vehiclepositions/models";
import { VehiclePositionsTripsModel } from "../../src/resources/vehiclepositions/models/VehiclePositionsTripsModel";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";

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
        { logging: false },
    );

    it("should instantiate", () => {
        expect(vehiclepositionsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await vehiclepositionsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
        expect(result.type).to.be.equal("FeatureCollection");
    });
});
