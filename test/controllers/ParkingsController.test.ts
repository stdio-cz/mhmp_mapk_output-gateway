"use strict";

import "mocha";
import { ParkingsController } from "../../src/controllers/ParkingsController";
const config = require("../../dist/config/config");
import Database from "../../src/helpers/Database";

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const log = require("debug")("data-platform:output-gateway");

chai.use(chaiAsPromised);

describe("ParkingsController", () => {

    let controller: ParkingsController;
    let parkingId: number;
    let coordinates: Array<number>;

    before(() => {
        controller = new ParkingsController();
        parkingId = 534202;
        coordinates = [50.032074, 14.492015];
    });

    it("should instantiate", () => {
        expect(controller).not.to.be.undefined;
    });

    it("should have GetAll method", () => {
        expect(controller.GetAll).not.to.be.undefined;
    });

    it("should have GetByCoordinates method", () => {
        expect(controller.GetByCoordinates).not.to.be.undefined;
    });

    // TODO: Mock ParkingsModel

});
