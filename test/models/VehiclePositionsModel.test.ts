"use strict";

import "mocha";
import { models } from "../../src/resources/vehiclepositions/models";
import { VehiclePositionsTripsModel } from "../../src/resources/vehiclepositions/models/VehiclePositionsTripsModel";

import { expect } from "chai";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";

chai.use(chaiAsPromised);

describe("VehiclePositionsTripsModel", () => {

    const vehiclepositionsModel: VehiclePositionsTripsModel = models.VehiclePositionsTripsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(vehiclepositionsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await vehiclepositionsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.data).to.be.an.instanceOf(Object);
        expect(result.data.features).to.be.an.instanceOf(Array);
        expect(result.data.type).to.be.equal("FeatureCollection");
    });
});
