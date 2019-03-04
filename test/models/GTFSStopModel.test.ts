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
import {GTFSStopModel} from "../../src/models/GTFSStopModel";

chai.use(chaiAsPromised);

describe("GTFSStopModel", () => {

    const stopModel: GTFSStopModel = models.GTFSStopModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const stopId: string = "U1072Z101P";

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
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stops.json")),
        ],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(stopModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await stopModel.GetAll();
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(34);
        expect(result.type).to.be.equal("FeatureCollection");
    });

    // let tripId: number;
    it("should return few items", async () => {
        const result = await stopModel.GetAll({limit: 10, offset: 10});
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result.type).to.be.equal("FeatureCollection");
        expect(result.features[0]).to.have.property("geometry");
        expect(result.features[0]).to.have.property("properties");
        expect(result.features[0]).to.have.property("type", "Feature");
        // expect(result.features[0]).to.have.property("trip_id");
        // tripId = result.features[0].trip_id;
    });

    it("should return single item", async () => {
        const stop: any = await stopModel.GetOne(stopId);
        expect(stop).not.to.be.empty;
        expect(stop.properties).to.have.property("stop_id", stopId);
        expect(stop).to.have.property("geometry");
        expect(stop).to.have.property("properties");
        expect(stop).to.have.property("type", "Feature");
    });

    // Mock database doesnt have postgis functions for geo
    // it("should return all stops close to the point", async () => {
    //     const result: any = await stopModel.GetAll({
    //         lat: 50.11548,
    //         lng: 14.43732,
    //         range: 1000,
    //     });
    //     expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(10);
    //     expect(result.type).to.be.equal("FeatureCollection");
    // });
});
