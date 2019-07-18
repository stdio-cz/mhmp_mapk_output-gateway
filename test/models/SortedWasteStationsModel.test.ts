"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { SortedWasteStationsModel } from "../../src/resources/sortedwastestations/SortedWasteStationsModel";

chai.use(chaiAsPromised);

describe("SortedWasteStationsModel", () => {

    let sortedWasteStationsModel: SortedWasteStationsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWasteStationsModel = new SortedWasteStationsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sortedWasteStationsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWasteStationsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await sortedWasteStationsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });
});
