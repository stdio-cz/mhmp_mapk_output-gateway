import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import request from "supertest";
import sinon from "sinon";
import express from "@golemio/core/dist/shared/express";
import { config } from "@golemio/core/dist/output-gateway/config";
import App from "../src/App";

chai.use(chaiAsPromised);

describe("App", () => {
    let expressApp: express.Application;
    let app: App;
    let sandbox: any;
    let exitStub: any;

    before(async () => {
        app = new App();
        await app.start();
        expressApp = app.express;
    });

    beforeEach(() => {
        sandbox = sinon.createSandbox({ useFakeTimers: true });
        exitStub = sandbox.stub(process, "exit");
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should start", async () => {
        expect(expressApp).not.to.be.undefined;
    });

    it("should have all config variables set", () => {
        expect(config).not.to.be.undefined;
        expect(config.mongo_connection).not.to.be.undefined;
    });

    it("should have health check on /", (done) => {
        request(expressApp).get("/").set("Accept", "application/json").expect("Content-Type", /json/).expect(200, done);
    });

    it("should have health check on /health-check", (done) => {
        request(expressApp)
            .get("/health-check")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should return 404 on non-existing route /non-existing", (done) => {
        request(expressApp)
            .get("/non-existing")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(404, done);
    });

    it("should respond with 400 BAD REQUEST to GET /parkings/?latlng&range with bad parameters", (done) => {
        request(expressApp).get("/parkings/?latlng=50.032074,14.492015&range=asd").expect(400, done);
    });

    describe("Compression", () => {
        it("should support gzip compression", async () => {
            const response = await request(expressApp).get("/parking/tariffs?source=korid").set("Accept-Encoding", "gzip");
            expect(response.get("Content-Type")).to.match(/json/);
            expect(response.get("Content-Encoding")).to.equal("gzip");
            expect(response.get("Content-Length")).to.equal(undefined);
            // expect(response.headers).to.include({ "content-encoding": "gzip" });
            // expect(response.headers["content-length"]).to.equal(undefined);
        });

        it("should not compress if content length bellow threshold", async () => {
            const response = await request(expressApp).get("/parking/tariffs?source=non-existent").set("Accept-Encoding", "gzip");
            expect(response.get("Content-Type")).to.match(/json/);
            expect(response.get("Content-Encoding")).to.equal(undefined);
            expect(response.get("Content-Length")).to.equal("2");
        });

        it("should not compress if 'Accept-Encoding' is not set", async () => {
            // rewrite Accept-Encoding as it is set by default
            const response = await request(expressApp).get("/parking/tariffs?source=korid").set("Accept-Encoding", "");
            expect(response.get("Content-Type")).to.match(/json/);
            expect(response.get("Content-Encoding")).to.equal(undefined);
            expect(response.get("Content-Length")).to.equal("2052");
        });
    });
});
