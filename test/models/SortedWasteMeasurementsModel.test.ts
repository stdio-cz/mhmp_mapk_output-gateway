"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { SortedWasteMeasurementsModel } from "../../src/resources/sortedwastestations/SortedWasteMeasurementsModel";

chai.use(chaiAsPromised);

describe("SortedWasteMeasurementsModel", () => {

    let sortedWasteMeasurements: SortedWasteMeasurementsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWasteMeasurements = new SortedWasteMeasurementsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [],
        { logging: false },
    );

    it("should instantiate", () => {
        expect(sortedWasteMeasurements).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWasteMeasurements.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });
});
