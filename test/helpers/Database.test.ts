"use strict";

import "mocha";
const config = require("../../src/config/config");
import Database from "../../src/helpers/MongoDatabase";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import log from "../../src/helpers/Logger";

chai.use(chaiAsPromised);

describe("Database", () => {
    const uri: string = config.mongo_connection || "";
    let database: Database;

    before(() => {
        database = new Database(uri);
    });

    it("should instantiate", () => {
        expect(database).not.to.be.undefined;
    });

    it("should have connect method", () => {
        expect(database.connect).not.to.be.undefined;
    });

    it("should connect ", async () => {
        log.info("Connecting to: " + uri);
        let connection = database.connect();
        await expect(connection).to.be.fulfilled;
    });

});
