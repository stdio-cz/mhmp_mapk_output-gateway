"use strict";

import "mocha";
import { mongooseConnection } from "../../src/core/database";
import { ParkingZonesModel } from "../../src/resources/parkingzones/ParkingZonesModel";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { log } from "../../src/core/Logger";

const gJsonTools = require("geojson-tools");

chai.use(chaiAsPromised);

describe("ParkingZonesModel", () => {

    let model: ParkingZonesModel;
    let parkingZoneCode: string;
    let coordinates: number[];

    before(async () => {
        await mongooseConnection;
        model = new ParkingZonesModel();
        parkingZoneCode = "P1-0101";
        coordinates = [50.0912829985439, 14.3895151983103];
    });

    it("should instantiate", () => {
        expect(model).not.to.be.undefined;
    });

    it("should not fail trying to create the same model again", () => {
        const model2 = new ParkingZonesModel();
        expect(model2).not.to.be.undefined;
    });

    it("should have GetAll method", () => {
        expect(model.GetAll).not.to.be.undefined;
    });

    it("should have GetAllTariffs method", () => {
        expect(model.GetAllTariffs).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetAll call", async () => {
        const promise = model.GetAll();
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        await expect(promise).to.be.fulfilled;
    });

    it("should return all records as GeoJson FeatureCollection", async () => {
        const data = await model.GetAll();
        expect(data).to.be.an.instanceOf(Object);
        expect(data.features).to.be.an.instanceOf(Array);
        expect(data.type).to.be.equal("FeatureCollection");
    });

    it("should return all tariffs as array with tariff_id as hash", async () => {
        const data: any[] = await model.GetAllTariffs();
        expect(data).to.be.an.instanceOf(Array);
        expect(data[0]).to.has.property("tariff_id");
    });

    it("should return 2 first records (limit)", async () => {
        const data = await model.GetAll({ limit: 2 });
        expect(data).to.be.an.instanceOf(Object);
        expect(data.features).to.be.an.instanceOf(Array);
        expect(data.type).to.be.equal("FeatureCollection");
        expect(data.features.length).to.be.equal(2);
    });

    it("should return 2nd record first (offset)", async () => {
        const dataFirst = await model.GetAll({ limit: 1, offset: 0 });
        const dataSecond = await model.GetAll({ limit: 1, offset: 1 });
        expect(dataFirst).not.to.be.equal(dataSecond);
    });

    it("should return by last updated (timestamp)", async () => {
        const currentDate = new Date().getTime();
        const data = await model.GetAll({ updatedSince: currentDate });
        // TODO: Better test to check if the data are recently updated
        expect(data.features.length).to.be.equal(0);
    });

    it("should fail on bad parameters", async () => {
        const promise = model.GetAll({ limit: -1, offset: -2 });
        await expect(promise).to.be.rejected;
    });

    it("should have GetOne method", () => {
        expect(model.GetOne).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetOne call", async () => {
        const promise = model.GetOne(parkingZoneCode);
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        await expect(promise).to.be.fulfilled;
    });

    it("should return one parking zone by code", async () => {
        const data = await model.GetOne(parkingZoneCode);
        expect(data).to.be.an.instanceOf(Object);
    });

    it("should throw an error (reject promise) for non-existing parking zone by code", async () => {
        const promise = model.GetOne("kovfefe");
        await expect(promise).to.be.rejected;
    });

    it("should return at least 2 records, sorted by the closest one (GetByCoordinates)", async () => {
        const data = await model.GetAll({ lat: coordinates[0], lng: coordinates[1] });
        const first = data.features[0];
        const second = data.features[1];
        // TODO: Add test to check getting by coordinates
    });

    it("should return by coordinates and limit and offset", async () => {
        const data = await model.GetAll({ lat: coordinates[0], lng: coordinates[1], limit: 2, offset: 1 });
        const first = data.features[0];
        const second = data.features[1];
        // TODO: Add test to check getting by coordinates
    });

    it("should return by coordinates and range", async () => {
        const range = 50;
        const data: any = await model.GetAll({ lat: coordinates[0], lng: coordinates[1], limit: 1 });
        const rangeData = await model.GetAll({
            lat: data.features[0].geometry.coordinates[0][0][1],
            lng: data.features[0].geometry.coordinates[0][0][0],
            range,
        });
        const firstFeature = rangeData.features[0];
        const lastFeature = rangeData.features[rangeData.features.length - 1];

        const first = gJsonTools.toArray(firstFeature.geometry);
        const last = gJsonTools.toArray(lastFeature.geometry);
        const distance = gJsonTools.getDistance([
            first,
            last,
        ], 4) * 1000;
        expect(distance <= range).to.be.true;
        expect(data.features.length).to.be.equal(1);
    });

    it("should have GetTariffsByParkingZoneId method", () => {
        expect(model.GetTariffsByParkingZoneId).not.to.be.undefined;
    });

    it("should return fulfilled promise to GetTariffs call", async () => {
        const promise = model.GetTariffsByParkingZoneId(parkingZoneCode);
        expect(Object.prototype.toString.call(promise)).to.equal("[object Promise]");
        await expect(promise).to.be.fulfilled;
    });

    it("should return one parking zone tariffs by code", async () => {
        const data = await model.GetTariffsByParkingZoneId(parkingZoneCode);
        expect(data).to.be.an.instanceOf(Object);
    });

    it("should throw an error (reject promise) for non-existing parking zone by code", async () => {
        const promise = model.GetTariffsByParkingZoneId("kovfefe");
        await expect(promise).to.be.rejected;
    });

    it("should throw an error (reject promise) for parking zone which has no tariffs", async () => {
        const promise = model.GetTariffsByParkingZoneId("kovfefe");
        await expect(promise).to.be.rejected;
    });

});
