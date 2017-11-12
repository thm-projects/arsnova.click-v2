// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../App';

chai.use(chaiHttp);
const expect = chai.expect;

const hashtag = 'mocha-test-api-v1';

@suite class NicksApiRouterTestSuite {
  private _baseApiRoute = `/api/v1/nicks`;

  @test async getBlockedNicks() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/blocked`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async getPredefinedNicks() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/predefined`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }
}
