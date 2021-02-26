import sinon from "sinon";
import request from "supertest";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { log } from "@golemio/core/dist/output-gateway/Logger";
import { sortedWasteRouterPg } from "@golemio/sorted-waste-stations/dist/output-gateway/sorted-waste-stations-pg/SortedWasteRouter";

chai.use(chaiAsPromised);

describe("SortedWaste Router", () => {
    // Create clean express instance
    const app = express();
    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    before(() => {
        // Mount the tested router to the express instance
        app.use("/sortedwastestationspg", sortedWasteRouterPg);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with json to GET /sortedwastestations", (done) => {
        request(app)
            .get("/sortedwastestationspg?limit=10")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /sortedwastestations/measurements", (done) => {
        request(app)
            .get("/sortedwastestationspg/measurements?limit=10")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with json to GET /sortedwastestations/picks?limit=10", (done) => {
        request(app)
            .get("/sortedwastestationspg/picks")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
