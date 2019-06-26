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
import { GTFSStopModel } from "../../src/resources/gtfs/models/GTFSStopModel";

chai.use(chaiAsPromised);

describe("GTFSStopModel", () => {

    const stopModel: GTFSStopModel = models.GTFSStopModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const stopId: string = "U1072Z101P";

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
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_stops.json")),
        ],
        { logging: false },
    );

    it("should instantiate", () => {
        expect(stopModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await stopModel.GetAll();
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(34);
        expect(result.type).to.be.equal("FeatureCollection");
    });

    it("should return few items", async () => {
        const result = await stopModel.GetAll({ limit: 10, offset: 10 });
        expect(result.features).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result.type).to.be.equal("FeatureCollection");
        expect(result.features[0]).to.have.property("geometry");
        expect(result.features[0]).to.have.property("properties");
        expect(result.features[0]).to.have.property("type", "Feature");
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
