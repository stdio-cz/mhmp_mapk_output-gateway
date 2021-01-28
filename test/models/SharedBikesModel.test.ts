import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { SharedBikesModel } from "@golemio/shared-bikes/dist/output-gateway/SharedBikesModel";

chai.use(chaiAsPromised);

describe("SharedBikesModel", () => {
    let sharedBikesModel: SharedBikesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 90;

    before(() => {
        sandbox = sinon.createSandbox();
        sharedBikesModel = new SharedBikesModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sharedBikesModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sharedBikesModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });
});
