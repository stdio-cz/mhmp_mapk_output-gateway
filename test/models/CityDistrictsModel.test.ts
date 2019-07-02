"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { CityDistrictsModel } from "../../src/resources/citydistricts/CityDistrictsModel";

chai.use(chaiAsPromised);

describe("CityDistrictsModel", () => {

    let cityDistrictsModel: CityDistrictsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id: string = "praha-petrovice";

    before(() => {
        sandbox = sinon.createSandbox();
        cityDistrictsModel = new CityDistrictsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(cityDistrictsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await cityDistrictsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await cityDistrictsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("slug", id);
    });
});
