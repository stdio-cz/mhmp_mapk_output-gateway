import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { SortedWasteMeasurementsModel } from "@golemio/sorted-waste-stations/dist/output-gateway/sorted-waste-stations/models";

chai.use(chaiAsPromised);

describe("SortedWasteMeasurementsModel", () => {
    let sortedWasteMeasurements: SortedWasteMeasurementsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWasteMeasurements = new SortedWasteMeasurementsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sortedWasteMeasurements).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWasteMeasurements.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });
});
