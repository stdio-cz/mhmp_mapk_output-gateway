"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { SharedBikesModel } from "../../src/resources/sharedbikes/SharedBikesModel";

chai.use(chaiAsPromised);

describe("SharedBikesModel", () => {

    let sharedBikesModel: SharedBikesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 90;

    before(() => {
        sandbox = sinon.createSandbox();
        sharedBikesModel = new SharedBikesModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sharedBikesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sharedBikesModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });
});
