"use strict";

import "mocha";

import * as chai from "chai";
import { expect } from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { BicycleCountersDetectionsModel } from "../../src/resources/bicyclecounters/models/BicycleCountersDetectionsModel";

chai.use(chaiAsPromised);

describe("BicycleCountersDetectionsModel", () => {

  let bicycleCountersDetectionsModel: BicycleCountersDetectionsModel;

  before(() => {
      bicycleCountersDetectionsModel = new BicycleCountersDetectionsModel();
  });

  it("should instantiate", () => {
      expect(bicycleCountersDetectionsModel).not.to.be.undefined;
  });

  describe("GetAll", async () => {
    describe("When called without params", () => {
      it("should return all items", async () => {
          const result = await bicycleCountersDetectionsModel.GetAll();
          expect(result).to.be.an.instanceOf(Array);
          expect(result.length).to.eql(29);
      });
    });
    describe("When called with id param", () => {
      it("should return correct subset of items", async () => {
        const result = await bicycleCountersDetectionsModel.GetAll({
          id: ["camea-BC_ZA-KL", "camea-BC_VK-UP"],
        });
        expect(result).to.be.an.instanceOf(Array);
        expect(result.length).to.eql(23);

        result.forEach((element: any) => {
          expect(element.id).to.satisfy((id: string) => {
            return ["camea-BC_ZA-KL", "camea-BC_VK-UP"].includes(id);
          });
        });
      });
    });

    describe("When called with isoDateTo and isoDateFrom params", () => {
      it("should return correct subset of items within given dates", async () => {
        const isoDateFrom = new Date("2020-03-14T09:35:00.000Z");
        const isoDateTo = new Date("2020-03-14T09:55:00.000Z");

        const result = await bicycleCountersDetectionsModel.GetAll({
          isoDateFrom,
          isoDateTo,
        });
        expect(result).to.be.an.instanceOf(Array);
        expect(result.length).to.eql(8);

        result.forEach((element: any) => {
          expect(element.measured_from).to.satisfy((measuredFrom: number) => {
            return measuredFrom <= isoDateTo.getTime();
          });
        });

        result.forEach((element: any) => {
          expect(element.measured_from).to.satisfy((measuredFrom: number) => {
            return measuredFrom >= isoDateFrom.getTime();
          });
        });
      });
    });

    describe("When called with aggregate param", () => {
      it("should return aggregated data for each location", async () => {

        const result = await bicycleCountersDetectionsModel.GetAll({
          aggregate: "1",
        });
        expect(result).to.be.an.instanceOf(Array);
        expect(result.length).to.eql(4);

        result.forEach((element: any) => {
          expect(element.id).to.satisfy((id: string) => {
            return ["camea-BC_ZA-KL", "camea-BC_VK-UP", "camea-BC_ZA-BO", "camea-BC_VK-HR"].includes(id);
          });

          expect(element.locations_id).to.satisfy((lid: string) => {
            return [3, 6, 17].includes(lid.split(",").length);
          });

          expect(element.value).to.satisfy((value: string) => {
            return ["85", "13", "24", "10"].includes(value);
          });
        });
      });
    });
  });
});
