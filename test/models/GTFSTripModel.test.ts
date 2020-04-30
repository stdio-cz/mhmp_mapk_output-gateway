"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { models } from "../../src/resources/gtfs/models";
import { GTFSTripsModel } from "../../src/resources/gtfs/models/GTFSTripsModel";

chai.use(chaiAsPromised);

describe("GTFSTripsModel", () => {

    const tripModel: GTFSTripsModel = models.GTFSTripsModel;
    let tripId: string;

    // Basic configuration: create a sinon sandbox for testing
    let sandbox: any = null;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox && sandbox.restore();
    });

    it("should instantiate", () => {
        expect(tripModel).not.to.be.undefined;
    });

    it("should return all items", async () => {
        const result = await tripModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
    });

    it("should return few items", async () => {
        const result = await tripModel.GetAll({ limit: 10, offset: 0 });
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
        expect(result[0]).to.have.property("trip_id");
        tripId = result[0].trip_id;
    });

    it("should return 10 items", async () => {
        const result = await tripModel.GetAll({ limit: 10, offset: 0 });
        expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
    });

    it("should return single item", async () => {
        const trip: any = await tripModel.GetOne(tripId);
        expect(trip).not.to.be.empty;
        expect(trip).to.have.property("trip_id", tripId);
    });

    it("should return all items going through stop id U953Z102P", async () => {
        const result = await tripModel.GetAll({ stopId: "U953Z102P" });
        expect(result).to.be.an.instanceOf(Array);
        expect(result.map((item: any) => item.trip_id))
            .to.be.an("array").to.include.members(
                [
                    "991_1151_190107",
                ]);
    });

    // TODO: Check for format of included data
    it("should return single trip with all included resources", async () => {
        const trip: any = await tripModel.GetOne(tripId, {
            route: true,
            service: true,
            shapes: true,
            stopTimes: true,
            stops: true,
        });

        expect(trip).to.be.an.instanceOf(Object);
        expect(trip).to.have.property("route").and.be.instanceOf(Object);
        let keys = [
            "agency_id",
            "is_night",
            "route_color",
            "route_id",
            "route_long_name",
            "route_short_name",
            "route_text_color",
            "route_type",
            "route_url",
            "route_desc",
        ];

        expect(trip.route).to.have.keys(keys);
        keys.pop(); // `route_desc` removed
        keys.forEach((prop) => {
            expect(trip.route[prop]).to.not.be.null;
        });

        expect(trip).to.have.property("service").and.be.instanceOf(Object);

        keys = [
            "end_date",
            "friday",
            "monday",
            "saturday",
            "service_id",
            "start_date",
            "sunday",
            "thursday",
            "tuesday",
            "wednesday",
            "create_batch_id",
            "created_at",
            "created_by",
            "update_batch_id",
            "updated_at",
            "updated_by",
        ];

        expect(trip.service).to.have.keys(keys);
        keys.forEach((prop) => {
            expect(trip.route[prop]).to.not.be.null;
        });

        expect(trip).to.have.property("shapes").and.be.instanceOf(Array);
        expect(trip.shapes.length).to.be.eql(2);
        expect(trip).to.have.property("stop_times").and.be.instanceOf(Array);
    });

});
