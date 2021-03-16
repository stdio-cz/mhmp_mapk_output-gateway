import request from "supertest";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import express from "@golemio/core/dist/shared/express";
import { RouterBuilder } from "@golemio/core/dist/output-gateway/routes";
import { generalRoutes } from "../src/generalRoutes";

chai.use(chaiAsPromised);

describe("generalRoutes", () => {
    const app: express.Application = express();
    const defaultRouter = express.Router();
    let routerBuilder: RouterBuilder;

    before(() => {
        app.use("/", defaultRouter);
        routerBuilder = new RouterBuilder(defaultRouter);
        routerBuilder.LoadData(generalRoutes);
        routerBuilder.BuildAllRoutes();
    });

    it("should respond with json to GET for all generic routes", async () => {
        const promises: request.Test[] = generalRoutes.map((x) => {
            const endpoint = "/" + x.name.toLowerCase();
            return request(app).get(endpoint).set("Accept", "application/json").expect("Content-Type", /json/).expect(200);
        });
        await Promise.all(promises);
    });
});
