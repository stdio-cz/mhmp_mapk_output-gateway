"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
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

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [],
        { logging: false },
    );

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
