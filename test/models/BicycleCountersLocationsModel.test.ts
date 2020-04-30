"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { models } from "../../src/resources/bicyclecounters/models";
import {
  BicycleCountersLocationsModel,
} from "../../src/resources/bicyclecounters/models/BicycleCountersLocationsModel";

chai.use(chaiAsPromised);

describe("BicycleCountersLocationsModel", () => {
  // we need to call Associate
  const bicycleCountersLocationsModel: BicycleCountersLocationsModel = models.BicycleCountersLocationsModel;

  it("should instantiate", () => {
      expect(bicycleCountersLocationsModel).not.to.be.undefined;
  });

  describe("GetAll", async () => {
    describe("When called without params", () => {
      it("should return all items", async () => {
        const result = await bicycleCountersLocationsModel.GetAll();
        expect(result).to.be.an.instanceOf(Array);
        expect(result.length).to.eql(5);
      });

    });
    describe("When called with lng, lat and range param", () => {
      it("should return correct subset of items", async () => {
        const result = await bicycleCountersLocationsModel.GetAll({
          lat: 50.089491724101,
          lng: 14.460735619068,
          range: 6000,
        });

        expect(result).to.be.an.instanceOf(Array);
        expect(result.length).to.eql(3);

        expect(result[0].distance).to.eql(0);
        expect(result[2].distance).to.eql(5758.59904834);
      });
    });
  });
});
