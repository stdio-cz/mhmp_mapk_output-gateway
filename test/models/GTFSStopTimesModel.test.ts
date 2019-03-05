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
import {models} from "../../src/models";
import {GTFSStopTimesModel} from "../../src/models/GTFSStopTimesModel";

chai.use(chaiAsPromised);

describe("GTFSStopTimesModel", () => {

    const stopTimesModel: GTFSStopTimesModel = models.GTFSStopTimesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const stopId: string = "U921Z102P";

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
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_routes.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_services.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_trips.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stops.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stop_times.json")),
        ],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(stopTimesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await stopTimesModel.GetAll(stopId);
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(6);
    });

    // FN regex_replace doesnt exist in sqlite mock
    // it("should return all items filtered by from time", async () => {
    //     const result = await stopTimesModel.GetAll(stopId, {from: "7:00:00"});
    //     expect(result).to.be.an.instanceOf(Array).and.lengthOf(6);
    // });
});
