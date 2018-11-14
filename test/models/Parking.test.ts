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

    before(() => {
        model = new Parking();
        const uri: string = config.mongo_connection || "";
        new Database(uri).connect();
        parkingId = 534202;
    });

    it("should instantiate", () => {
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
        expect(data).to.be.an.instanceOf(Object);
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

});
