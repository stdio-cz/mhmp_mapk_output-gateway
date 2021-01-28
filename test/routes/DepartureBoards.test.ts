import sinon from "sinon";
import request from "supertest";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { log } from "@golemio/core/dist/output-gateway/Logger";
import { departureBoardsRouter } from "@golemio/departure-boards/dist/output-gateway/DepartureBoardsRouter";

chai.use(chaiAsPromised);

describe("DepartureBoards Router", () => {
    // Create clean express instance
    const app = express();
    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "U118Z102P";

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    before(() => {
        // Mount the tested router to the express instance
        app.use("/departureboards", departureBoardsRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with list of stop times of specific stop /departureboards?ids", (done) => {
        request(app)
            .get(`/departureboards?ids[]=${id}`)
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should respond with 404 to non-existant stop /departureboards?ids", (done) => {
        request(app)
            .get("/departureboards?ids[]=kovfefe")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 404 to non-existant ASW stop /departureboards?aswIds", (done) => {
        request(app)
            .get("/departureboards?aswIds[]=85_12389")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 400 to unspecified ids (one of ids,cisIds,aswIds must be set)", (done) => {
        request(app)
            .get("/departureboards")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    });
});
