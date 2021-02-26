import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { GardensModel } from "@golemio/gardens/dist/output-gateway/GardensModel";

chai.use(chaiAsPromised);

describe("GardensModel", () => {
    let gardensModel: GardensModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "vojanovy-sady";

    before(() => {
        sandbox = sinon.createSandbox();
        gardensModel = new GardensModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(gardensModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await gardensModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await gardensModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });

    it("should return array of properties", async () => {
        const result: any = await gardensModel.GetProperties();
        expect(result).not.to.be.empty;
        expect(result).to.be.an.instanceof(Array);
    });
});
