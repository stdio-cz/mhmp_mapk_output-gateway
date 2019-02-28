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
import {GTFSTripsModel} from "../../src/models/GTFSTripsModel";

chai.use(chaiAsPromised);

describe("GTFSTripsModel", () => {

    const tripModel: GTFSTripsModel = models.GTFSTripsModel;

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
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_trips.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stop_times.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stops.json")),
        ],
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

    let tripId: number;
    it("should return few items", async () => {
        const result = await tripModel.GetAll({limit: 10, offset: 10});
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result.features[0]).to.have.property("trip_id");
        expect(result.type).to.be.equal("FeatureCollection");
        tripId = result.features[0].trip_id;
    });

    it("should return 10 items", async () => {
        const result = await tripModel.GetAll({limit: 10, offset: 10});
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result.type).to.be.equal("FeatureCollection");
    });

    it("should return single item", async () => {
        const result: any = await tripModel.GetOne(tripId);
        expect(result).not.to.be.empty;
        const trip = result.toJSON();
        expect(trip).to.have.property("trip_id", tripId);
    });

    it("should return all items going through stop id U953Z102P", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P"});
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result.type).to.be.equal("FeatureCollection");
        expect(result.features.map((item: any) => item.trip_id))
            .to.be.an("array").to.include.members(
            [
                "991_1156_180709",
                "991_1155_180709",
                "991_1154_180709",
                "991_1153_190107",
                "991_1152_190107",
                "991_1151_190107",
                "991_10_180709",
            ]);
    });
});
