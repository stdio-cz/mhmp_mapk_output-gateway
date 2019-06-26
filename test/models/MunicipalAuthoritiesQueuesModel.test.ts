"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { MunicipalAuthoritiesQueuesModel } from "../../src/resources/municipalauthorities/MunicipalAuthoritiesQueuesModel";

chai.use(chaiAsPromised);

describe("MunicipalAuthoritiesQueuesModel", () => {

    let municipalAuthoritiesQueuesModel: MunicipalAuthoritiesQueuesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const authorityId: string = "skoduv-palac";

    before(() => {
        sandbox = sinon.createSandbox();
        municipalAuthoritiesQueuesModel = new MunicipalAuthoritiesQueuesModel();
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
        expect(municipalAuthoritiesQueuesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await municipalAuthoritiesQueuesModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return all queues", async () => {
        const result = await municipalAuthoritiesQueuesModel.GetQueues(authorityId);
        expect(result).to.be.an.instanceOf(Object);
    });
});
