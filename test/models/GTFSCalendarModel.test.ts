import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { models } from "@golemio/ropid-gtfs/dist/output-gateway/models";
import { GTFSCalendarModel } from "@golemio/ropid-gtfs/dist/output-gateway/models/GTFSCalendarModel";

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
