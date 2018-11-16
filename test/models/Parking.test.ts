"use strict";

import "mocha";
import Parking from "../../src/models/Parking";
const config = require("../../dist/config/config");
import Database from "../../src/helpers/Database";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const log = require("debug")("data-platform:output-gateway");

chai.use(chaiAsPromised);

describe("ParkingModel", () => {

    let model: Parking;
    let parkingId: number;
    let coordinates: Array<number>;

    before(() => {
        model = new Parking();
        const uri: string = config.mongo_connection || "";
        new Database(uri).connect();
        parkingId = 534202;
        coordinates = [50.032074, 14.492015];
    });

    it("should instantiate", () => {
        expect(model).not.to.be.undefined;
    });

    it("should not fail trying to create the same model again", () => {
        const model2 = new Parking();
        expect(model).not.to.be.undefined;
    });

    it("should have GetAll method", () => {
        expect(model.GetAll).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetAll call", async () => {
        const promise = model.GetAll();
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        expect(promise).to.be.fulfilled;
    });

    it("should return all records", async () => {
        const data = await model.GetAll();
        expect(data).to.be.an.instanceOf(Array);
    });

    it("should return 2 first records (limit)", async () => {
        const data = await model.GetAll(2);
        expect(data).to.be.an.instanceOf(Array);
        expect(data.length).to.be.equal(2);
    });

    it("should return 2nd record first (offset)", async () => {
        const dataFirst = await model.GetAll(1, 0);
        const dataSecond = await model.GetAll(1, 1);
        expect(dataFirst).not.to.be.equal(dataSecond);
    });

    it("should return by last updated (timestamp)", async () => {
        const data = await model.GetAll(0, 0, new Date().getUTCMilliseconds());
        // TODO: Better test to check if the data are recently updated
        expect(data.length).to.be.equal(0);
    });

    it("should fail on bad parameters", async () => {
        const promise = model.GetAll(-1, -2);
        await expect(promise).to.be.rejected;
    });

    it("should have GetOne method", () => {
        expect(model.GetOne).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetOne call", async () => {
        const promise = model.GetOne(parkingId);
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        expect(promise).to.be.fulfilled;
    });

    it("should return one parking by id", async () => {
        const data = await model.GetOne(parkingId);
        expect(data).to.be.an.instanceOf(Object);
    });

    it("should return null for non-existing parking by id", async () => {
        const data = await model.GetOne(-1);
        expect(data).to.be.null;
    });

    it("should have GetByCoordinates method", () => {
        expect(model.GetByCoordinates).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetByCoordinates call", async () => {
        const promise = model.GetByCoordinates(coordinates[0], coordinates[1]);
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        expect(promise).to.be.fulfilled;
    });

    it("should return at least 2 records, sorted by the closest one (GetByCoordinates)", async () => {
        const data = await model.GetByCoordinates(coordinates[0], coordinates[1]);
        const first = data[0];
        const second = data[1];
        const diffFirstX = Math.abs(first.geometry.coordinates[0] - coordinates[1]);
        const diffSecondX = Math.abs(second.geometry.coordinates[0] - coordinates[1]);
        const diffFirstY = Math.abs(first.geometry.coordinates[1] - coordinates[0]);
        const diffSecondY = Math.abs(second.geometry.coordinates[1] - coordinates[0]);
        const isGreater: boolean = (diffSecondX - diffFirstX >= 0 && diffSecondY - diffFirstY >= 0);
        expect(isGreater).to.be.equal(true);
    });

    it("should return by coordinates and limit and offset", async () => {
        const data = await model.GetByCoordinates(coordinates[0], coordinates[1], undefined, 2, 1);
        const first = data[0];
        const second = data[1];
        const diffFirstX = Math.abs(first.geometry.coordinates[0] - coordinates[1]);
        const diffSecondX = Math.abs(second.geometry.coordinates[0] - coordinates[1]);
        const diffFirstY = Math.abs(first.geometry.coordinates[1] - coordinates[0]);
        const diffSecondY = Math.abs(second.geometry.coordinates[1] - coordinates[0]);
        const isGreater: boolean = (diffSecondX - diffFirstX >= 0 && diffSecondY - diffFirstY >= 0);
        const dataSecond = await model.GetByCoordinates(coordinates[0], coordinates[1], undefined, 2, 2);
        expect(data).not.to.be.equal(dataSecond);
        expect(isGreater).to.be.equal(true);
        expect(data.length).to.be.equal(2);
    });

    it("should return by coordinates and range", async () => {
        const data = await model.GetByCoordinates(coordinates[0], coordinates[1], 0);
        // TODO: Add test to check the last record in array that it is not further from coordinates than range
        expect(data.length).to.be.equal(1);
    });

    it("should fail on bad parameters", async () => {
        const promise = model.GetAll(-1, -2);
        await expect(promise).to.be.rejected;
    });

});
