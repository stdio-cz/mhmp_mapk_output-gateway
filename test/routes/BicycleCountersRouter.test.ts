"use strict";

import { HTTPErrorHandler, ICustomErrorObject } from "@golemio/errors";
import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as express from "express";
import { NextFunction, Request, Response } from "express";
import "mocha";
import * as request from "supertest";
import { log } from "../../src/core/Logger";
import { bicycleCountersRouter } from "../../src/resources/bicyclecounters/BicycleCountersRouter";

chai.use(chaiAsPromised);

describe("bicycleCountersRouter", () => {
    // Create clean express instance
    const app = express();

    before(() => {
        // Mount the tested router to the express instance
        app.use("/bicyclecounters", bicycleCountersRouter);
        app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            const errObject: ICustomErrorObject = HTTPErrorHandler.handle(err);
            log.silly("Error caught by the router error handler.");
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.status(errObject.error_status || 500).send(errObject);
        });
    });

    it("should respond with correctly to GET /bicyclecounters", (done) => {
        request(app)
            .get("/bicyclecounters?latlng=50.089491724101,14.460735619068&range=17000&limit=2&offset=1")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, {
                features: [
                   {
                      geometry: {
                         coordinates: [
                            14.3857008,
                            50.0704264,
                         ],
                         type: "Point",
                      },
                      properties: {
                         directions: [
                            {
                               id: "camea-BC_VS-CE",
                               name: "centrum",
                            },
                         ],
                         id: "camea-BC_VS-CE",
                         name: "Košíře",
                         route: "A 14",
                         updated_at: "2020-03-22T14:50:01.167Z",
                      },
                      type: "Feature",
                   },
                   {
                      geometry: {
                         coordinates : [
                            14.3993322,
                            50.1433144,
                         ],
                         type: "Point",
                      },
                      properties: {
                         directions: [
                            {
                               id: "camea-BC_ZA-KL",
                               name: "Klecany",
                            },
                            {
                               id: "camea-BC_ZA-BO",
                               name: "Bohnice",
                            },
                         ],
                         id: "camea-BC_ZA-KLBO",
                         name: "V Zámcích",
                         route: "A2",
                         updated_at: "2020-03-22T14:50:01.167Z",
                      },
                      type: "Feature",
                   },
                ],
                type: "FeatureCollection",
             }, done);
    });

    it("should respond correctly to GET /bicyclecounters/detections", (done) => {
        request(app)
            .get("/bicyclecounters/detections?id=camea-BC_ZA-BO&id=camea-BC_ZA-KL&limit=2&offset=1&from=2020-03-14T10:30:00.000Z&to=2020-03-14T11:00:00.000Z")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, [
                {
                    id: "camea-BC_ZA-KL",
                    locations_id: "camea-BC_ZA-KLBO",
                    measured_from: "2020-03-14T10:45:00.000Z",
                    measured_to: "2020-03-14T10:50:00.000Z",
                    measurement_count: 1,
                    value: 10,
                    value_pedestrians: 2,
                },
                {
                    id: "camea-BC_ZA-KL",
                    locations_id: "camea-BC_ZA-KLBO",
                    measured_from: "2020-03-14T10:40:00.000Z",
                    measured_to: "2020-03-14T10:45:00.000Z",
                    measurement_count: 1,
                    value: 3,
                    value_pedestrians: 1,
                },
              ], done);
    });

    it("should respond correctly to GET /bicyclecounters/temperatures", (done) => {
        request(app)
            .get("/bicyclecounters/temperatures?id[]=camea-BC_ZA-KLBO&id[]=ecoCounter-100047647&limit=4&offset=2&from=2020-03-14T09:55:00.000Z&to=2020-03-14T10:15:00.000Z")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200, [
                {
                    id: "camea-BC_ZA-KLBO",
                    measured_from: "2020-03-14T10:05:00.000Z",
                    measured_to: "2020-03-14T10:10:00.000Z",
                    measurement_count: 1,
                    value: 10,
                },
                {
                    id: "camea-BC_ZA-KLBO",
                    measured_from: "2020-03-14T10:10:00.000Z",
                    measured_to: "2020-03-14T10:15:00.000Z",
                    measurement_count: 1,
                    value: 10,
                },
              ], done);
    });
});
