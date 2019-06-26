"use strict";

import "mocha";

const sequelizeMockingMocha = require("sequelize-mocking").sequelizeMockingMocha;
import * as path from "path";

import { sequelizeConnection as sequelize } from "../../src/core/database/PostgreDatabase";

import * as sinon from "sinon";
import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { log } from "../../src/core/Logger";
import { models } from "../../src/resources/gtfs/models";
import { GTFSShapesModel } from "../../src/resources/gtfs/models/GTFSShapesModel";

chai.use(chaiAsPromised);

describe("GTFSShapesModel", () => {

    const shapeModel: GTFSShapesModel = models.GTFSShapesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

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
            //    path.resolve(path.join(__dirname, "../data/dataplatform/ropidgtfs_shapes.json")),
        ],
        { logging: false },
    );
    /*
        it("should instantiate", () => {
            expect(shapeModel).not.to.be.undefined;
        });
    
        it("should return all items", async () => {
            const result = await shapeModel.GetAll();
            expect(result).to.be.an.instanceOf(Array).and.lengthOf(0);
        });*/
});
