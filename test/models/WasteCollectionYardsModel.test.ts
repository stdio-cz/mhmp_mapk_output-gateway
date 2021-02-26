import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { WasteCollectionYardsModel } from "@golemio/waste-collection-yards/dist/output-gateway/WasteCollectionYardsModel";

chai.use(chaiAsPromised);

describe("WasteCollectionYardsModel", () => {
    let wasteCollectionYardsModel: WasteCollectionYardsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "sberny-dvur-hlavniho-mesta-prahy-probostska";

    before(() => {
        sandbox = sinon.createSandbox();
        wasteCollectionYardsModel = new WasteCollectionYardsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(wasteCollectionYardsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await wasteCollectionYardsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await wasteCollectionYardsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });

    it("should return array of properties", async () => {
        const result: any = await wasteCollectionYardsModel.GetProperties();
        expect(result).not.to.be.empty;
        expect(result).to.be.an.instanceof(Array);
    });
});
