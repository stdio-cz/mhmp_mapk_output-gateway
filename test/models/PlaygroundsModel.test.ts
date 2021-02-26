import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { PlaygroundsModel } from "@golemio/playgrounds/dist/output-gateway/PlaygroundsModel";

chai.use(chaiAsPromised);

describe("PlaygroundsModel", () => {
    let playgroundsModel: PlaygroundsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = 90;

    before(() => {
        sandbox = sinon.createSandbox();
        playgroundsModel = new PlaygroundsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(playgroundsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await playgroundsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.features).to.be.an.instanceOf(Array);
    });

    it("should return single item", async () => {
        const route: any = await playgroundsModel.GetOne(id);
        expect(route).not.to.be.empty;
        expect(route.properties).to.have.property("id", id);
    });

    it("should return array of properties", async () => {
        const result: any = await playgroundsModel.GetProperties();
        expect(result).not.to.be.empty;
        expect(result).to.be.an.instanceof(Array);
    });
});
