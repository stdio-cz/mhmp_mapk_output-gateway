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
import { GTFSShapesModel } from "../../src/resources/gtfs/models/GTFSShapesModel";

chai.use(chaiAsPromised);

describe("GTFSShapesModel", () => {

    const shapeModel: GTFSShapesModel = models.GTFSShapesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const shapeId: string = "L991V1";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    // Load fake data for the users
    sequelizeMockingMocha(
        sequelize,
        [],
        {logging: false},
    );

    it("should instantiate", () => {
        expect(shapeModel).not.to.be.undefined;
    });

    // it("should return all items", async () => {
    //     const result = await shapeModel.GetAll();
    //     expect(result).to.be.an.instanceOf(Array).and.lengthOf(0);
    // });
    //
    // it("should return single item", async () => {
    //     const shape: any = await shapeModel.GetOne(shapeId);
    //     expect(shape).to.be.null;
    //     // expect(shape.properties).to.have.property("shape_id", shapeId);
    //     // expect(shape).to.have.property("geometry");
    //     // expect(shape).to.have.property("properties");
    //     // expect(shape).to.have.property("type", "Feature");
    // });
});
