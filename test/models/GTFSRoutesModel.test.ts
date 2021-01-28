import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { models } from "@golemio/ropid-gtfs/dist/output-gateway/models";
import { GTFSRoutesModel } from "@golemio/ropid-gtfs/dist/output-gateway/models/GTFSRoutesModel";

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
