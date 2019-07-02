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

    let tripId: string;
    it("should return few items", async () => {
        // TODO add data to db
        const result = await tripModel.GetAll({ limit: 10, offset: 10 });
        /* expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
         expect(result[0]).to.have.property("trip_id");
         tripId = result[0].trip_id;*/
    });

    it("should return 10 items", async () => {
        const result = await tripModel.GetAll({ limit: 10, offset: 10 });
        // TODO add data to db
        // expect(result).to.be.an.instanceOf(Array).and.lengthOf(10);
    });

    it("should return single item", async () => {
        const trip: any = await tripModel.GetOne(tripId);
        // TODO add data to db
        /* expect(trip).not.to.be.empty;
         expect(trip).to.have.property("trip_id", tripId); */
    });

    it("should return all items going through stop id U953Z102P", async () => {
        const result = await tripModel.GetAll({ stopId: "U953Z102P" });
        console.log(result);
        expect(result).to.be.an.instanceOf(Array);
        expect(result.map((item: any) => item.trip_id))
            .to.be.an("array").to.include.members(
                [
                    "991_1156_180709",
                    "991_1155_180709",
                    "991_1154_180709",
                    "991_1153_190107",
                    "991_1152_190107",
                    "991_1151_190107",
                    "991_10_180709",
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
        expect(trip).to.have.property("service").and.be.instanceOf(Object);
        expect(trip).to.have.property("shapes").and.be.instanceOf(Array).and.lengthOf(0);
        expect(trip).to.have.property("stop_times").and.be.instanceOf(Array).and.lengthOf(0);
    });

});
