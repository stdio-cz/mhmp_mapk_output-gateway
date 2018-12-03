"use strict";

import "mocha";
import * as app from "../src/App";
const config = require("../src/config/config");

const chai = require("chai");
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
const log = require("debug")("data-platform:output-gateway");
const request = require('supertest')('localhost:' + config.port);

const express = require('express');

chai.use(chaiAsPromised);

describe("App", () => {

    before(() => {
    });

    it('should start', () => {
        expect(app).not.to.be.undefined;
    });

    it('should have all config variables set', () => {
        log(config);
        expect(config).not.to.be.undefined;
        expect(config.mongo_connection).not.to.be.undefined;
    });

    it('should have health check on /', () => {
        request
          .get('/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);
    });

    it('should have response time below 100ms', () => {
        request
          .get('/')
          .expect(200);
    });

    it('should have health check on /health-check', () => {
        request
          .get('/health-check')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200);
    });

    it('should return 404 on non-existing route /non-existing', () => {
        request
          .get('/non-existing')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404);
    });
});