import request from "supertest";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/core/dist/shared/golemio-errors";
import express, { NextFunction, Request, Response } from "@golemio/core/dist/shared/express";
import { log } from "@golemio/core/dist/output-gateway/Logger";
import { exportingModuleRouter } from "@golemio/exporting-module/dist/output-gateway/ExportingModuleRouter";

chai.use(chaiAsPromised);

describe("ExportingModuleRouter", () => {
    // Create clean express instance
    const app = express();

    before(() => {
        // Mount the tested router to the express instance
        app.use("/export", exportingModuleRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with correctly to GET /bicyclecounters_detections/meta", () => {
        return request(app)
            .get("/export/bicyclecounters_detections/meta")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                chai.expect(response.body.sort((a: any, b: any) => (a.name > b.name ? 1 : -1))).to.be.deep.equal(
                    [
                        {
                            name: "locations_id",
                            label: "locations_id",
                            valueEditorType: "text",
                            inputType: "text",
                        },
                        {
                            name: "directions_id",
                            label: "directions_id",
                            valueEditorType: "text",
                            inputType: "text",
                        },
                        {
                            name: "measured_from",
                            label: "measured_from",
                            valueEditorType: "text",
                            inputType: "number",
                        },
                        {
                            name: "measured_to",
                            label: "measured_to",
                            valueEditorType: "text",
                            inputType: "number",
                        },
                        {
                            name: "value",
                            label: "value",
                            valueEditorType: "text",
                            inputType: "number",
                        },
                        {
                            name: "value_pedestrians",
                            label: "value_pedestrians",
                            valueEditorType: "text",
                            inputType: "number",
                        },
                    ].sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
                );
            });
    });

    it("should respond correctly to GET /export/bicyclecounters_detections/preview", (done) => {
        request(app)
            .post("/export/bicyclecounters_detections/preview")
            .send({
                columns: ["locations_id", "directions_id", "measured_from", "measured_to", "value"],
                order: [
                    {
                        direction: "asc",
                        column: "locations_id",
                    },
                    {
                        direction: "asc",
                        column: "directions_id",
                    },
                    {
                        direction: "asc",
                        column: "measured_from",
                    },
                    {
                        direction: "asc",
                        column: "measured_to",
                    },
                    {
                        direction: "asc",
                        column: "value",
                    },
                ],
                offset: 1,
                builderQuery: {
                    combinator: "and",
                    not: false,
                    rules: [
                        {
                            field: "locations_id",
                            operator: "notNull",
                            value: "",
                        },
                        {
                            combinator: "and",
                            rules: [
                                {
                                    field: "measured_to",
                                    operator: ">",
                                    value: "1",
                                },
                            ],
                        },
                    ],
                },
            })
            .set("Accept", "text/plain")
            .expect("Content-Type", /text/)
            .expect(
                200,
                '"locations_id","directions_id","measured_from","measured_to","value"\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-HR","1584178800000","1584179100000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-HR","1584183300000","1584183600000",4\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584178500000","1584178800000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584178800000","1584179100000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584180000000","1584180300000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584181200000","1584181500000",6\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584181800000","1584182100000",5\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584183000000","1584183300000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584178500000","1584178800000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584180300000","1584180600000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584182700000","1584183000000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584177900000","1584178200000",3\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178200000","1584178500000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178500000","1584178800000",3\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178800000","1584179100000",6\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179100000","1584179400000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179400000","1584179700000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179700000","1584180000000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180000000","1584180300000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180300000","1584180600000",6',
                done
            );
    });

    it("should respond correctly to GET /export/bicyclecounters_detections/data", (done) => {
        request(app)
            .post("/export/bicyclecounters_detections/data")
            .send({
                columns: ["locations_id", "directions_id", "measured_from", "measured_to", "value"],
                order: [
                    {
                        direction: "asc",
                        column: "locations_id",
                    },
                    {
                        direction: "asc",
                        column: "directions_id",
                    },
                    {
                        direction: "asc",
                        column: "measured_from",
                    },
                    {
                        direction: "asc",
                        column: "measured_to",
                    },
                    {
                        direction: "asc",
                        column: "value",
                    },
                ],

                limit: 50,
                offset: 1,
                builderQuery: {
                    combinator: "and",
                    not: false,
                    rules: [
                        {
                            field: "locations_id",
                            operator: "notNull",
                            value: "",
                        },
                        {
                            combinator: "and",
                            rules: [
                                {
                                    field: "measured_to",
                                    operator: ">",
                                    value: "1",
                                },
                            ],
                        },
                    ],
                },
            })
            .expect(
                200,
                '"locations_id","directions_id","measured_from","measured_to","value"\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-HR","1584178800000","1584179100000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-HR","1584183300000","1584183600000",4\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584178500000","1584178800000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584178800000","1584179100000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584180000000","1584180300000",3\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584181200000","1584181500000",6\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584181800000","1584182100000",5\n' +
                    '"camea-BC_VK-HRUP","camea-BC_VK-UP","1584183000000","1584183300000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584178500000","1584178800000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584180300000","1584180600000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-BO","1584182700000","1584183000000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584177900000","1584178200000",3\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178200000","1584178500000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178500000","1584178800000",3\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584178800000","1584179100000",6\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179100000","1584179400000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179400000","1584179700000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584179700000","1584180000000",5\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180000000","1584180300000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180300000","1584180600000",6\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180600000","1584180900000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584180900000","1584181200000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584181200000","1584181500000",4\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584181800000","1584182100000",6\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584182100000","1584182400000",11\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584182400000","1584182700000",3\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584182700000","1584183000000",10\n' +
                    '"camea-BC_ZA-KLBO","camea-BC_ZA-KL","1584183000000","1584183300000",3',
                done
            );
    });

    it("should respond correctly to GET /export/bicyclecounters_detections/data with groupBy", (done) => {
        request(app)
            .post("/export/bicyclecounters_detections/data")
            .send({
                columns: ["measured_from", "count(value) as value"],
                order: [
                    {
                        direction: "asc",
                        column: "measured_from",
                    },
                    {
                        direction: "asc",
                        column: "value",
                    },
                ],
                groupBy: ["measured_from", "value"],
                limit: 50,
                offset: 1,
                builderQuery: {
                    combinator: "and",
                    not: false,
                    rules: [
                        {
                            field: "measured_from",
                            operator: ">",
                            value: "1",
                        },
                    ],
                },
            })
            .expect(
                200,
                '"measured_from","value"\n' +
                    '"1584178200000","1"\n' +
                    '"1584178500000","1"\n' +
                    '"1584178500000","2"\n' +
                    '"1584178800000","1"\n' +
                    '"1584178800000","2"\n' +
                    '"1584179100000","1"\n' +
                    '"1584179400000","1"\n' +
                    '"1584179700000","1"\n' +
                    '"1584180000000","1"\n' +
                    '"1584180000000","1"\n' +
                    '"1584180300000","1"\n' +
                    '"1584180300000","1"\n' +
                    '"1584180600000","1"\n' +
                    '"1584180900000","1"\n' +
                    '"1584181200000","1"\n' +
                    '"1584181200000","1"\n' +
                    '"1584181800000","1"\n' +
                    '"1584181800000","1"\n' +
                    '"1584182100000","1"\n' +
                    '"1584182400000","1"\n' +
                    '"1584182700000","1"\n' +
                    '"1584182700000","1"\n' +
                    '"1584183000000","1"\n' +
                    '"1584183000000","1"\n' +
                    '"1584183300000","1"',
                done
            );
    });
});
