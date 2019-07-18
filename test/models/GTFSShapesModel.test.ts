"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
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

    it("should instantiate", () => {
        expect(shapeModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await shapeModel.GetAll({ id: "L991V1" });
        expect(result).to.be.an.instanceof(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });
});
