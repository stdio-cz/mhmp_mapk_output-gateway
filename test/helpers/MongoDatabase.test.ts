"use strict";

import "mocha";
const config = require("../../src/config/config");
import { mongooseConnection } from "../../src/core/database";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import { log } from "../../src/core/Logger";

chai.use(chaiAsPromised);

describe("Mongo Database", () => {
    const uri: string = config.mongo_connection || "";

    it("should instantiate", () => {
        expect(mongooseConnection).not.to.be.undefined;
    });

    it("should connect ", async () => {
        log.info("Connecting to: " + uri);

        await expect(mongooseConnection).to.be.fulfilled;
    });

});
