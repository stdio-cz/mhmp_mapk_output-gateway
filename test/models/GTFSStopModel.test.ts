"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { models } from "../../src/resources/gtfs/models";
import { GTFSStopModel } from "../../src/resources/gtfs/models/GTFSStopModel";

chai.use(chaiAsPromised);

describe("GTFSStopModel", () => {

    const stopModel: GTFSStopModel = models.GTFSStopModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const stopId: string = "U476Z103P";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(stopModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await stopModel.GetAll();
        expect(result.features).to.be.an.instanceOf(Array);
        expect(result.type).to.be.equal("FeatureCollection");
    });

    it("should return few items", async () => {
        const result = await stopModel.GetAll({ limit: 10, offset: 0 });
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

    it("should return proper item for aswId[] 286_1", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "286_1" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(1);
        expect(stops.features[0].properties).to.have.property("stop_id", "U286Z1P");
    });

    it("should return proper item for aswId[] 286_101", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "286_101" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(1);
        expect(stops.features[0].properties).to.have.property("stop_id", "U286Z101P");
    });

    it("should return all 9 items for aswId[] 286", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "286" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(9);
    });

    it("should return all 9 items for aswId[] 286_", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "286_" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(9);
    });

    it("should return all 9 items for cisId[] 55083", async () => {
        const stops: any = await stopModel.GetAll({
            cisIds: [ 55083 ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(9);
    });

    it("should return 2 items for aswId[] 286_101 and 286_102", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "286_101", "286_102" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(2);
        expect(stops.features[0].properties).to.have.property("stop_id", "U286Z101P");
        expect(stops.features[1].properties).to.have.property("stop_id", "U286Z102P");
    });

    it("should return proper item for ids[] U286Z4", async () => {
        const stops: any = await stopModel.GetAll({
            gtfsIds: [ "U286Z4" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(1);
        expect(stops.features[0].properties).to.have.property("stop_id", "U286Z4");
    });

    it("should return 9 items for names[] Háje", async () => {
        const stops: any = await stopModel.GetAll({
            names: [ "Háje" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(9);
        for (const feature of stops.features) {
            expect(feature.properties).to.have.property("stop_name", "Háje");
        }
    });

    it("should return both origin and new stop for aswIds[] 115/101", async () => {
        const stops: any = await stopModel.GetAll({
            aswIds: [ "115/101" ],
        });
        expect(stops).not.to.be.empty;
        expect(stops.features.length).to.be.equal(2);
        expect(stops.features[0].properties).to.have.property("stop_id", "U115Z101P");
        expect(stops.features[1].properties).to.have.property("stop_id", "U115Z101P_900222");
    });

    it("should properly parse ASW id from GTFS id", async () => {
        const parsedId: any = await stopModel.parseAswId("U115Z101P");
        expect(parsedId.node).to.be.equal(115);
        expect(parsedId.stop).to.be.equal(101);
    });

    it("should properly parse ASW id from GTFS id without P", async () => {
        const parsedId: any = await stopModel.parseAswId("U115Z101");
        expect(parsedId.node).to.be.equal(115);
        expect(parsedId.stop).to.be.equal(101);
    });

    it("should properly parse ASW id from GTFS id with suffix", async () => {
        const parsedId: any = await stopModel.parseAswId("U115Z101P_22021990");
        expect(parsedId.node).to.be.equal(115);
        expect(parsedId.stop).to.be.equal(101);
    });

    it("should return null for not valid input", async () => {
        const parsedId: any = await stopModel.parseAswId("U115Z");
        expect(parsedId).to.be.null;
    });

    it("should return null for not valid input", async () => {
        const parsedId: any = await stopModel.parseAswId("U115");
        expect(parsedId).to.be.null;
    });

    // This test will fail if PostGIS is not installed
    // it("should return all stops close to the point", async () => {
    //     const result: any = await stopModel.GetAll({
    //         lat: 50.11548,
    //         lng: 14.43732,
    //         range: 1000,
    //     });
    //     expect(result.features).to.be.an.instanceOf(Array);
    //     expect(result.type).to.be.equal("FeatureCollection");
    // });
});
