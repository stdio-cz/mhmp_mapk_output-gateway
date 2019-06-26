"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { SortedWastePicksModel } from "../../src/resources/sortedwastestations/SortedWastePicksModel";

chai.use(chaiAsPromised);

describe("SortedWastePicksModel", () => {

    let sortedWastePicksModel: SortedWastePicksModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWastePicksModel = new SortedWastePicksModel();
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
        expect(sortedWastePicksModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWastePicksModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });
});
