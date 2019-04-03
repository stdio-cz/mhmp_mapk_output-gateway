"use strict";

import "mocha";
const config = require("../../src/config/config");
import { MongoDatabase } from "../../src/core/database";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import { log } from "../../src/core/Logger";

chai.use(chaiAsPromised);

describe("Mongo Database", () => {
    const uri: string = config.mongo_connection || "";
    let database: MongoDatabase;

    before(() => {
        database = new MongoDatabase();
    });

    it("should instantiate", () => {
        expect(database).not.to.be.undefined;
    });

    it("should have connect method", () => {
        expect(database.connect).not.to.be.undefined;
    });

    it("should connect ", async () => {
        log.info("Connecting to: " + uri);
        const connection = database.connect();
        await expect(connection).to.be.fulfilled;
    });

});
