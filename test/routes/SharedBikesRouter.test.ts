import sinon from "sinon";
import request from "supertest";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { log } from "@golemio/core/dist/output-gateway/Logger";
import { sharedBikesRouter } from "@golemio/shared-bikes/dist/output-gateway/SharedBikesRouter";

chai.use(chaiAsPromised);

describe("SharedBikes Router", () => {
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
        app.use("/sharedbikes", sharedBikesRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with json to GET /sharedbikes", (done) => {
        request(app).get("/sharedbikes").set("Accept", "application/json").expect("Content-Type", /json/).expect(200, done);
    });

    it("GET /sharedbikes?companyName=HOMEPORT should only return HOMEPORT bikes", (done) => {
        request(app)
            .get("/sharedbikes?companyName=HOMEPORT")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an.instanceOf(Object);
                expect(res.body.features).to.be.an.instanceOf(Array);
                expect(res.body.type).to.be.equal("FeatureCollection");
                const obj = res.body.features;
                for (const entry of obj) {
                    // todo: make this more efficient
                    expect(entry.properties.company.name).to.be.equal("HOMEPORT");
                }
                done();
            });
    });

    it("GET /sharedbikes?companyName=Rekola should only return Rekola bikes", (done) => {
        request(app)
            .get("/sharedbikes?companyName=Rekola")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an.instanceOf(Object);
                expect(res.body.features).to.be.an.instanceOf(Array);
                expect(res.body.type).to.be.equal("FeatureCollection");
                const obj = res.body.features;
                for (const entry of obj) {
                    // todo: make this more efficient
                    expect(entry.properties.company.name).to.be.equal("Rekola");
                }
                done();
            });
    });
});
