"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
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

    it("should instantiate", () => {
        expect(routeModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await routeModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await routeModel.GetOne(routeId);
        expect(route).not.to.be.empty;
        expect(route).to.have.property("route_id", routeId);
    });
});
