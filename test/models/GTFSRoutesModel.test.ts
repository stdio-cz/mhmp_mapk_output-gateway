"use strict";

import "mocha";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

const sequelize = require("../../src/helpers/PostgreDatabase").default;

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import log from "../../src/helpers/Logger";
import {models} from "../../src/models";
import {GTFSRoutesModel} from "../../src/models/GTFSRoutesModel";

chai.use(chaiAsPromised);

describe("GTFSStopModel", () => {

    const routeModel: GTFSRoutesModel = models.GTFSRoutesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const routeId: string = "L991";

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [
            path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_routes.json")),
        ],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(routeModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await routeModel.GetAll();
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(1);
    });

    it("should return single item", async () => {
        const route: any = await routeModel.GetOne(routeId);
        expect(route).not.to.be.empty;
        expect(route).to.have.property("route_id", routeId);
    });
});
