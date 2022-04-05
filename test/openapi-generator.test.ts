import chai, { expect, assert } from "chai";
import chaiAsPromised from "chai-as-promised";

import { MergeConfigPreparator } from "../src/doc-generator/MergeConfigPreparator";
const fs = require("fs");

chai.use(chaiAsPromised);

describe("MergeConfigPreparator", () => {
    let mergeConfigPreparator: MergeConfigPreparator;

    before(async () => {
        mergeConfigPreparator = new MergeConfigPreparator();
    });

    it("should have makeConfigs method", async () => {
        expect(mergeConfigPreparator.makeConfigs).not.to.be.undefined;
    });

    it("should work without falling", async () => {
        const processResult = await mergeConfigPreparator.makeConfigs();
        expect(processResult).to.equal("✅ API documentation configs were prepared successfully");
    });

    it("should create config files", async () => {
        assert.isOk(fs.existsSync("./src/doc-generator/generated-merge-configs/openapi-merge-config.json"));
        assert.isOk(fs.existsSync("./src/doc-generator/generated-merge-configs/public-openapi-merge-config.json"));
    });
});
