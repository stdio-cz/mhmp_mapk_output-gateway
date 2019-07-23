"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { MunicipalAuthoritiesModel } from "../../src/resources/municipalauthorities";

chai.use(chaiAsPromised);

describe("MunicipalAuthoritiesModel", () => {

    let municipalAuthoritiesModel: MunicipalAuthoritiesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id: string = "urad-mestske-casti-praha-benice";

    before(() => {
        sandbox = sinon.createSandbox();
        municipalAuthoritiesModel = new MunicipalAuthoritiesModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(municipalAuthoritiesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await municipalAuthoritiesModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await municipalAuthoritiesModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });
});
