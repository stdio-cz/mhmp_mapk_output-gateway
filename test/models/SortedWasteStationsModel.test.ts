import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { SortedWasteStationsModel } from "@golemio/sorted-waste-stations/dist/output-gateway/sorted-waste-stations/models";

chai.use(chaiAsPromised);

describe("SortedWasteStationsModel", () => {
    let sortedWasteStationsModel: SortedWasteStationsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 2;

    before(() => {
        sandbox = sinon.createSandbox();
        sortedWasteStationsModel = new SortedWasteStationsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(sortedWasteStationsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await sortedWasteStationsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return only monitored items", async () => {
        const result = await sortedWasteStationsModel.GetAll({
            additionalFilters: { "properties.containers": { $elemMatch: { sensor_container_id: { $exists: true } } } },
        });
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
        for (const station of result.features) {
            expect(station.properties.is_monitored).to.be.equal(true);
        }
    });

    it("should return single item", async () => {
        const route: any = await sortedWasteStationsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });
});
