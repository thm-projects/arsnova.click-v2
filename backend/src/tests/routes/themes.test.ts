// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../../App';
import {staticStatistics} from '../../statistics';

chai.use(chaiHttp);
const expect = chai.expect;

@suite class ThemeApiRouterTestSuite {
  private _baseApiRoute = `${staticStatistics.routePrefix}/api/v1/themes`;

  @test
  async getAllThemes() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(res.body.payload).to.be.an('array');
  }

  /*
  This Test will fail or not fail depending if the backend has been able to generate the frontend screenshots before
   */
  @test.skip
  async getTheme() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/theme-Material/en`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('image/png');
  }
}
