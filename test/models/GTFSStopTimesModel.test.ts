import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { models } from "@golemio/ropid-gtfs/dist/output-gateway/models";
import { GTFSStopTimesModel } from "@golemio/ropid-gtfs/dist/output-gateway/models/GTFSStopTimesModel";

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
