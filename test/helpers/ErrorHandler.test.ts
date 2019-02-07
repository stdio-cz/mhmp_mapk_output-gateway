"use strict";

import "mocha";
import CustomError from "../../src/helpers/errors/CustomError";
import handleError from "../../src/helpers/errors/ErrorHandler";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const sinon = require("sinon");

chai.use(chaiAsPromised);

describe("ErrorHandler", () => {

    let sandbox: any;
    let exitStub: any;

    beforeEach(() => {
        sandbox = sinon.createSandbox({ useFakeTimers : true });
        exitStub = sandbox.stub(process, "exit");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should handle non-operational error and exit the app", async () => {
        handleError(new Error("Test"));
        sinon.assert.called(exitStub);
    });

    it("should handle operational 400 error", async () => {
        const res = await handleError(new CustomError("Test", true, 400, "TestError"));
        sinon.assert.notCalled(exitStub);
        expect(res.error_status).to.be.equal(400);
    });

    it("should handle operational 404 error", async () => {
        const res = await handleError(new CustomError("Test", true, 404, "TestError"));
        sinon.assert.notCalled(exitStub);
        expect(res.error_status).to.be.equal(404);
    });

    it("should handle operational 409 error", async () => {
        const res = await handleError(new CustomError("Test", true, 409, "TestError"));
        sinon.assert.notCalled(exitStub);
        expect(res.error_status).to.be.equal(409);
    });

    it("should handle operational 500 error", async () => {
        const res = await handleError(new CustomError("Test", true));
        sinon.assert.notCalled(exitStub);
        expect(res.error_status).to.be.equal(500);
    });

});
