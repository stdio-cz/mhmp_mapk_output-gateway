"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { models } from "../../src/resources/gtfs/models";
import { GTFSCalendarModel } from "../../src/resources/gtfs/models/GTFSCalendarModel";

chai.use(chaiAsPromised);

describe("GTFSCalendarModel", () => {

    const serviceModel: GTFSCalendarModel = models.GTFSCalendarModel;

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
        [
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_services.json")),
        ],
        { logging: false },
    );

    it("should instantiate", () => {
        expect(serviceModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await serviceModel.GetAll();
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(2);
    });
});
