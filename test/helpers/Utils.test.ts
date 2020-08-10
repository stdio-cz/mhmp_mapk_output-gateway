"use strict";

import "mocha";
const config = require("../../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
import { parseBooleanQueryParam } from "../../src/core/Utils";

chai.use(chaiAsPromised);

describe("Utils functions", () => {

    it("should return false for undefined", () => {
        expect(parseBooleanQueryParam(undefined)).to.be.false;
    });

    it("should return false for false", () => {
        expect(parseBooleanQueryParam("false")).to.be.false;
    });

    it("should return true for true", () => {
        expect(parseBooleanQueryParam("true")).to.be.true;
    });

    it("should return true for True case insensitive", () => {
        expect(parseBooleanQueryParam("True")).to.be.true;
    });
});
