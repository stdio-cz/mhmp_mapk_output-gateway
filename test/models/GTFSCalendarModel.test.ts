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
import {models} from "../../src/models";
import {GTFSCalendarModel} from "../../src/models/GTFSCalendarModel";

chai.use(chaiAsPromised);

describe("GTFSCalendarModel", () => {

    const serviceModel: GTFSCalendarModel = models.GTFSCalendarModel;

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
        [
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_services.json")),
        ],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(serviceModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await serviceModel.GetAll();
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(2);
    });
});
