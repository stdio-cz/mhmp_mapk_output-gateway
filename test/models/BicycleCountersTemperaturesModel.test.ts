import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { BicycleCountersTemperaturesModel } from "@golemio/bicycle-counters/dist/output-gateway/models/BicycleCountersTemperaturesModel";

chai.use(chaiAsPromised);

describe("BicycleCountersTemperaturesModel", () => {
    let bicycleCountersTemperaturesModel: BicycleCountersTemperaturesModel;

    before(() => {
        bicycleCountersTemperaturesModel = new BicycleCountersTemperaturesModel();
    });

    it("should instantiate", () => {
        expect(bicycleCountersTemperaturesModel).not.to.be.undefined;
    });

    describe("GetAll", async () => {
        describe("When called without params", () => {
            it("should return all items", async () => {
                const result = await bicycleCountersTemperaturesModel.GetAll();
                expect(result).to.be.an.instanceOf(Array);
                expect(result.length).to.eql(36);
            });
        });
        describe("When called with id param", () => {
            it("should return correct subset of items", async () => {
                const result = await bicycleCountersTemperaturesModel.GetAll({
                    id: ["camea-BC_ZA-KLBO"],
                });
                expect(result).to.be.an.instanceOf(Array);
                expect(result.length).to.eql(16);

                result.forEach((element: any) => {
                    expect(element.id).to.satisfy((id: string) => {
                        return ["camea-BC_ZA-KLBO"].includes(id);
                    });
                });
            });
        });

        describe("When called with isoDateTo and isoDateFrom params", () => {
            it("should return correct subset of items within given dates", async () => {
                const isoDateFrom = new Date("2020-03-14T09:35:00.000Z");
                const isoDateTo = new Date("2020-03-14T09:55:00.000Z");

                const result = await bicycleCountersTemperaturesModel.GetAll({
                    isoDateFrom,
                    isoDateTo,
                });
                expect(result).to.be.an.instanceOf(Array);
                expect(result.length).to.eql(6);

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
                const result = await bicycleCountersTemperaturesModel.GetAll({
                    aggregate: "1",
                });
                expect(result).to.be.an.instanceOf(Array);
                expect(result.length).to.eql(2);

                result.forEach((element: any) => {
                    expect(element.id).to.satisfy((id: string) => {
                        return ["camea-BC_VK-HRUP", "camea-BC_ZA-KLBO"].includes(id);
                    });

                    expect(element.value).to.satisfy((value: number) => {
                        return [10.44, 10.25].includes(Math.round(value * 100) / 100);
                    });
                });
            });
        });
    });
});
