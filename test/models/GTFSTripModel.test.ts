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
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_routes.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_services.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_trips.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stops.json")),
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stop_times.json")),
        ],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(tripModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await tripModel.GetAll();
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(44);
    });

    let tripId: string;
    it("should return few items", async () => {
        const result = await tripModel.GetAll({limit: 10, offset: 10});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result[0]).to.have.property("trip_id");
        tripId = result[0].trip_id;
    });

    it("should return 10 items", async () => {
        const result = await tripModel.GetAll({limit: 10, offset: 10});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
    });

    it("should return single item", async () => {
        const result: any = await tripModel.GetOne(tripId);
        expect(result).not.to.be.empty;
        const trip = result.toJSON();
        expect(trip).to.have.property("trip_id", tripId);
    });

    it("should return all items going through stop id U953Z102P", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P"});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result.map((item: any) => item.trip_id))
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

    it("should return 7 items and include stops", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P", stops: true});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("stops").and.be.instanceOf(Array).and.lengthOf(17);
        expect(result[0].stops[0]).to.have.property("geometry");
        expect(result[0].stops[0]).to.have.property("properties");
        expect(result[0].stops[0]).to.have.property("type", "Feature");
    });

    it("should return 7 items and include stop times", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P", stopTimes: true});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("stop_times").and.be.instanceOf(Array).and.lengthOf(17);
    });

    it("should return 7 items and include shapes", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P", shapes: true});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("shapes").and.be.instanceOf(Array).and.lengthOf(0);
    });

    it("should return 7 items and include services", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P", service: true});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("service").and.be.instanceOf(Object);
    });

    it("should return 7 items and include route", async () => {
        const result = await tripModel.GetAll({stopId: "U953Z102P", route: true});
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("route").and.be.instanceOf(Object);
    });

    it("should return 7 items and include all possible inclusions", async () => {
        const result = await tripModel.GetAll({
            route: true,
            service: true,
            shapes: true,
            stopId: "U953Z102P",
            stopTimes: true,
            stops: true,
        });
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(7);
        expect(result[0]).to.have.property("route").and.be.instanceOf(Object);
        expect(result[0]).to.have.property("service").and.be.instanceOf(Object);
        expect(result[0]).to.have.property("stops").and.be.instanceOf(Array).and.lengthOf(17);
        expect(result[0]).to.have.property("shapes").and.be.instanceOf(Array).and.lengthOf(0);
        expect(result[0]).to.have.property("stop_times").and.be.instanceOf(Array).and.lengthOf(17);
    });

    it("should return single trip with included resources", async () => {
        const result: any = await tripModel.GetOne(tripId, {
            route: true,
            service: true,
            shapes: true,
            stopTimes: true,
            stops: true,
        });
        const trip = result.toJSON();
        expect(trip).to.be.an.instanceOf(Object);
        expect(trip).to.have.property("route").and.be.instanceOf(Object);
        expect(trip).to.have.property("service").and.be.instanceOf(Object);
        expect(trip).to.have.property("stops").and.be.instanceOf(Array).and.lengthOf(0);
        expect(trip).to.have.property("shapes").and.be.instanceOf(Array).and.lengthOf(0);
        expect(trip).to.have.property("stop_times").and.be.instanceOf(Array).and.lengthOf(0);
    });

    // FN to_date doesnt exist in sqlite mock
    // it("should return trips for specific date", async () => {
    //     const result = await tripModel.GetAll({date: "2019-02-28"});
    //     expect(result).to.be.an.instanceOf(Array).and.lengthOf(44);
    // });
});
