import sinon from "sinon";
import request from "supertest";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import moment from "@golemio/core/dist/shared/moment-timezone";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { log } from "@golemio/core/dist/output-gateway/Logger";
import { pidRouter } from "@golemio/pid/dist/output-gateway/PIDRouter";

chai.use(chaiAsPromised);

describe("PIDDepartureBoards Router", () => {
    // Create clean express instance
    const app = express();
    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;
    const id = "U118Z102P";
    const todayYMD = moment().format("YYYY-MM-DD");

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    before(() => {
        // Mount the tested router to the express instance
        app.use("/pid", pidRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with list of stop times of specific stop /departureboards?ids", (done) => {
        request(app)
            .get(`/pid/departureboards?ids[]=${id}`)
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body.departures).to.be.an("array");
                expect(res.body.stops).to.be.an("array");
                expect(res.body.infotexts).to.be.an("array");
                done();
            });
    });

    it("should respond with 404 to non-existant stop /departureboards?ids", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=kovfefe")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 404 to non-existant ASW stop /departureboards?aswIds", (done) => {
        request(app)
            .get("/pid/departureboards?aswIds[]=85_12389")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
    });

    it("should respond with 400 to unspecified ids (one of ids,cisIds,aswIds must be set)", (done) => {
        request(app)
            .get("/pid/departureboards")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(400);
                done();
            });
    });

    it("should respond with 8 departures", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U953Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=departures")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(8);
                done();
            });
    });

    it("should respond with ZERO departures for first stop when mode arrivals", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U953Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=arrivals")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(0);
                done();
            });
    });

    it("should respond with ZERO departures for stop with dropoff_type 1 when mode arrivals", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U921Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=arrivals")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(0);
                done();
            });
    });

    it("should respond with 8 departures for stop with dropoff_type 1 when mode departures", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U921Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=departures")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(8);
                done();
            });
    });

    it("should respond with ZERO departures for stop with pickup_type 1 when mode departures", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U118Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=departures")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(0);
                done();
            });
    });

    it("should respond with 8 departures for stop with pickup_type 1 when mode arrivals", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U118Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=arrivals")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(8);
                done();
            });
    });

    it("should respond with ZERO departures for LAST stop of trip when mode departures", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U306Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=departures")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(0);
                done();
            });
    });

    it("should respond with 8 departures for LAST stop of trip when mode arrivals", (done) => {
        request(app)
            .get("/pid/departureboards?ids[]=U306Z102P&minutesBefore=1000000&minutesAfter=1000000&mode=arrivals")
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(8);
                done();
            });
    });

    it("should respond with 1 departure with timeFrom used", (done) => {
        request(app)
            .get(`/pid/departureboards?ids[]=U713Z102P&minutesBefore=10&minutesAfter=30&timeFrom=${todayYMD}T06:00:00Z`)
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(1);
                done();
            });
    });

    it("should respond with no departures with timeFrom used outside of scheduled departures", (done) => {
        request(app)
            .get(`/pid/departureboards?ids[]=U713Z102P&minutesBefore=10&minutesAfter=30&timeFrom=${todayYMD}T08:00:00Z`)
            .end((err: any, res: any) => {
                expect(res.body.departures).to.have.lengthOf(0);
                done();
            });
    });
});
