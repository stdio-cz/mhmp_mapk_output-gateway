"use strict";

import "mocha";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

const sequelize = require("../../src/helpers/PostgreDatabase").default;

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import log from "../../src/helpers/Logger";
import {GTFSTripsModel} from "../../src/models/GTFSTripsModel";

chai.use(chaiAsPromised);

describe("GTFSTripsModel", () => {

    const tripModel: GTFSTripsModel = new GTFSTripsModel();

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
        path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_trips.json")),
        {logging: false},
    );

    it("should instantiate", () => {
        expect(tripModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await tripModel.GetAll();
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(44);
        expect(result.type).to.be.equal("FeatureCollection");
    });

});
