"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { BicycleCountersModel } from "../../src/resources/bicyclecounters";

chai.use(chaiAsPromised);

describe("BicycleCountersModel", () => {

    let bicycleCountersModel: BicycleCountersModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "5dc547e9c12b8c6acc70bb7b";

    before(() => {
        sandbox = sinon.createSandbox();
        bicycleCountersModel = new BicycleCountersModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(bicycleCountersModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await bicycleCountersModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return only filtered items", async () => {
        const result = await bicycleCountersModel.GetAll(
            {
                ids: [id],
            },
        );
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
        for (const item of result.features) {
            expect((item as any).properties.id.toString()).to.be.equal(id);
        }
    });

    // it("should return single item", async () => {
    //     const route: any = await bicycleCountersModel.GetOne(id);
    //     expect(route).not.to.be.empty;
    //     expect(route.properties).to.have.property("id", id);
    // });
});
