// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import chaiHttp = require('chai-http');

import app from '../../App';

chai.use(chaiHttp);
const expect = chai.expect;

@suite class ApiRouterTestSuite {
  private _baseApiRoute = `/api/v1/`;

  @test async baseApiExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }
}
