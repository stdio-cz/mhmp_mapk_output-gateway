import request from "supertest";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import express from "@golemio/core/dist/shared/express";
import { parkingZonesRouter } from "@golemio/parking-zones/dist/output-gateway/ParkingZonesRouter";

chai.use(chaiAsPromised);

describe("ParkingZonesRouter", () => {
    const app = express();
    let parkingZoneCode: string;

    before(() => {
        parkingZoneCode = "P1-0101";
        app.use("/parkingzones", parkingZonesRouter);
    });

    it("should respond with json to GET /parkingzones", (done) => {
        request(app).get("/parkingzones").set("Accept", "application/json").expect("Content-Type", /json/).expect(200, done);
    });

    it("should respond with GeoJson FeatureCollection to GET /parkingzones", (done) => {
        request(app)
            .get("/parkingzones")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an.instanceOf(Object);
                expect(res.body.features).to.be.an.instanceOf(Array);
                expect(res.body.type).to.be.equal("FeatureCollection");
                done();
            });
    });

    it("should respond with Tariffs array to GET /parkingzones/tariffs", (done) => {
        request(app)
            .get("/parkingzones/tariffs")
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an.instanceOf(Array);
                done();
            });
    });

    it("should respond with json to GET /parkingzones/:id ", (done) => {
        request(app)
            .get("/parkingzones/" + parkingZoneCode)
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });

    it("should respond with parking zone object to GET /parkingzones/:id ", (done) => {
        request(app)
            .get("/parkingzones/" + parkingZoneCode)
            .end((err: any, res: any) => {
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.an("object");
                expect(res.body.properties.id).to.be.equal(parkingZoneCode);
                expect(res.body.properties.payment_link).to.be.a("string");
                done();
            });
    });

    it("should respond with json to GET /parkingzones/:id/tariffs ", (done) => {
        request(app)
            .get("/parkingzones/" + parkingZoneCode + "/tariffs")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, done);
    });
});
