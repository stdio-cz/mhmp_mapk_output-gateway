import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { DepartureBoardsModel } from "@golemio/departure-boards/dist/output-gateway/DepartureBoardsModel";

chai.use(chaiAsPromised);

describe("DepartureBoardsModel", () => {
    let departureBoardsModel: DepartureBoardsModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "U953Z102P";

    before(() => {
        sandbox = sinon.createSandbox();
        departureBoardsModel = new DepartureBoardsModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(departureBoardsModel).not.to.be.undefined;
    });

    it("should return array of valid stop times objects", async () => {
        const result = await departureBoardsModel.GetAll({
            gtfsIds: [id],
            minutesAfter: 24 * 60,
            minutesBefore: 24 * 60,
        });
        expect(result).to.be.an.instanceOf(Array);
        expect(result[0]).to.be.an.instanceOf(Object);
        expect(result[0]).to.haveOwnProperty("delay_minutes");
        expect(result[0]).to.haveOwnProperty("is_delay_available");
        expect(result[0]).to.haveOwnProperty("departure_time");
        expect(result[0]).to.haveOwnProperty("arrival_datetime");
        expect(result[0]).to.haveOwnProperty("departure_datetime");
        expect(result[0]).to.haveOwnProperty("arrival_datetime_real");
        expect(result[0]).to.haveOwnProperty("route_short_name");
        expect(result[0]).to.haveOwnProperty("trip_id");
        expect(result[0]).to.haveOwnProperty("service_id");
    });

    it("should return 404 to non-existant stop_id", async () => {
        const resultPromise = departureBoardsModel.GetAll({
            gtfsIds: ["kovfefe"],
            minutesAfter: 60,
            minutesBefore: 10,
        });
        await expect(resultPromise).to.be.rejected;
    });
});
