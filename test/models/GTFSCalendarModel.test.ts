"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { models } from "../../src/resources/gtfs/models";
import { GTFSCalendarModel } from "../../src/resources/gtfs/models/GTFSCalendarModel";

chai.use(chaiAsPromised);

describe("GTFSCalendarModel", () => {

    const serviceModel: GTFSCalendarModel = models.GTFSCalendarModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(serviceModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await serviceModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });
});
