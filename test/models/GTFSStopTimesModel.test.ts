"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { models } from "../../src/resources/gtfs/models";
import { GTFSStopTimesModel } from "../../src/resources/gtfs/models/GTFSStopTimesModel";

chai.use(chaiAsPromised);

describe("GTFSStopTimesModel", () => {

    const stopTimesModel: GTFSStopTimesModel = models.GTFSStopTimesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const stopId: string = "U921Z102P";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(stopTimesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await stopTimesModel.GetAll({ stopId });
        expect(result).to.be.an.instanceOf(Array);
    });

    it("should return all items filtered by from time", async () => {
        const result = await stopTimesModel.GetAll({ stopId, from: "7:00:00" });
        expect(result).to.be.an.instanceOf(Array);
    });
});
