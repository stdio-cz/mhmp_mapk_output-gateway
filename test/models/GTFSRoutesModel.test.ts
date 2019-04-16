"use strict";

import "mocha";

const config = require("../../src/config/config");

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;

import * as path from "path";

import { sequelizeConnection as sequelize} from "../../src/core/database/PostgreDatabase";

const sinon = require("sinon");
const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import { log } from "../../src/core/Logger";
import { models } from "../../src/resources/gtfs/models";
import { GTFSRoutesModel } from "../../src/resources/gtfs/models/GTFSRoutesModel";

chai.use(chaiAsPromised);

describe("GTFSRoutesModel", () => {

    const routeModel: GTFSRoutesModel = models.GTFSRoutesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const routeId: string = "L991";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
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
