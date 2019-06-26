"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { SortedWasteStationsModel } from "../../src/resources/sortedwastestations/SortedWasteStationsModel";

chai.use(chaiAsPromised);

describe("SortedWasteStationsModel", () => {

    let sortedWasteStationsModel: SortedWasteStationsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWasteStationsModel = new SortedWasteStationsModel();
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
        expect(sortedWasteStationsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWasteStationsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await sortedWasteStationsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });
});
