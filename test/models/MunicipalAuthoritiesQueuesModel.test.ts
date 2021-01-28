import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import { MunicipalAuthoritiesQueuesModel } from "@golemio/municipal-authorities/dist/output-gateway/models/MunicipalAuthoritiesQueuesModel";

chai.use(chaiAsPromised);

describe("MunicipalAuthoritiesQueuesModel", () => {
    let municipalAuthoritiesQueuesModel: MunicipalAuthoritiesQueuesModel;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const authorityId: string = "skoduv-palac";

    before(() => {
        sandbox = sinon.createSandbox();
        municipalAuthoritiesQueuesModel = new MunicipalAuthoritiesQueuesModel();
    });

    after(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(municipalAuthoritiesQueuesModel).not.to.be.undefined;
    });

    it("should have GetOne, GetAll and GetQueuesByOfficeId methods", () => {
        expect(municipalAuthoritiesQueuesModel.GetOne).not.to.be.undefined;
        expect(municipalAuthoritiesQueuesModel.GetQueuesByOfficeId).not.to.be.undefined;
        expect(municipalAuthoritiesQueuesModel.GetAll).not.to.be.undefined;
    });

    it("should return all queues for one Municipal Authority office", async () => {
        const result = await municipalAuthoritiesQueuesModel.GetQueuesByOfficeId(authorityId);
        expect(result).to.be.an.instanceOf(Object);
        expect(result.municipal_authority_id).not.to.be.undefined;
        expect(result.municipal_authority_id).to.be.equal(authorityId);
    });
});
