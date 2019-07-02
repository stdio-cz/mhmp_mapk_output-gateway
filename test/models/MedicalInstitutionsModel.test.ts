"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { MedicalInstitutionsModel } from "../../src/resources/medicalinstitutions/MedicalInstitutionsModel";

chai.use(chaiAsPromised);

describe("MedicalInstitutionsModel", () => {

    let medicalInstitutionsModel: MedicalInstitutionsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id: string = "01995093000-adamova-lekarna";

    before(() => {
        sandbox = sinon.createSandbox();
        medicalInstitutionsModel = new MedicalInstitutionsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(medicalInstitutionsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await medicalInstitutionsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await medicalInstitutionsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });
});
