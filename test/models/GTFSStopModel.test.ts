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
