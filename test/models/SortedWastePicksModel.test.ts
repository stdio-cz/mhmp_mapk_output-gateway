"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { SortedWastePicksModel } from "../../src/resources/sortedwastestations";

chai.use(chaiAsPromised);

describe("SortedWastePicksModel", () => {

    let sortedWastePicksModel: SortedWastePicksModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWastePicksModel = new SortedWastePicksModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sortedWastePicksModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWastePicksModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });
});
