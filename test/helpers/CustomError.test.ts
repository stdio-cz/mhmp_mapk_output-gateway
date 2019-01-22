"use strict";

import "mocha";
import CustomError from "../../src/helpers/errors/CustomError";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe("CustomError", () => {

    let error1: CustomError;
    let error2: CustomError;
    let error3: CustomError;
    let error4: CustomError;
    let error5: CustomError;
    let tmpNodeEnv: string | undefined;

    before(() => {
        tmpNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = "test";
    });

    after(() => {
        process.env.NODE_ENV = tmpNodeEnv;
    });

    beforeEach(() => {
        error1 = new CustomError("Test error");
        error2 = new CustomError("Test error", true);
        error3 = new CustomError("Test error", true,  4002, "smth fucked up");
    });

    it("should properly return error description as string", async () => {
        expect(error1.toString()).to.be.equal("Test error");
        expect(error2.toString()).to.be.equal("Test error");
        expect(error3.toString()).to.be.equal("[4002] Test error (smth fucked up)");
    });

    it("should properly return error description as object", async () => {
        expect(error1.toObject()).to.have.property("error_message");
        expect(error2.toObject()).to.have.property("error_message");
        expect(error3.toObject()).to.have.property("error_message");
        expect(error3.toObject()).to.have.property("error_code");
        expect(error3.toObject().error_code).to.be.equal(4002);
    });

});
