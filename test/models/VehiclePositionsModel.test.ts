import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { models } from "@golemio/vehicle-positions/dist/output-gateway/models";
import { VehiclePositionsTripsModel } from "@golemio/vehicle-positions/dist/output-gateway/models/VehiclePositionsTripsModel";

chai.use(chaiAsPromised);

describe("VehiclePositionsTripsModel", () => {
    const vehiclepositionsModel: VehiclePositionsTripsModel = models.VehiclePositionsTripsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(vehiclepositionsModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await vehiclepositionsModel.GetAll();
        expect(result).to.be.an.instanceOf(Object);
        expect(result.data).to.be.an.instanceOf(Object);
        expect(result.data.features).to.be.an.instanceOf(Array);
        expect(result.data.type).to.be.equal("FeatureCollection");
    });
});
