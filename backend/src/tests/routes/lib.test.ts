// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');

import router from '../../App';
import {IQuestionGroup} from '../../interfaces/questions/interfaces';

chai.use(chaiHttp);
const expect = chai.expect;

@suite class LibRouterTestSuite {
  private _baseApiRoute = `/lib`;

  @test async baseApiExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}`);
    expect(res.type).to.eql('application/json');
  }

  /*
  This Test will fail or not fail depending if the backend has been able to generate the frontend favicons before
   */
  @test.skip
  async faviconExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}/favicon`);
    expect(res.type).to.eql('image/png');
  }
}

@suite class MathjaxLibRouterTestSuite {
  private _baseApiRoute = '/lib/mathjax';

  @test async mathjaxExists() {
    const res = await chai.request(router).post(`${this._baseApiRoute}`).send({
      mathjax: JSON.stringify('\\begin{align} a_1& =b_1+c_1/\\\\ a_2& =b_2+c_2-d_2+e_2 /\\end{align}'),
      format: 'TeX',
      output: 'svg'
    });
    expect(res.type).to.eql('text/html');
  }

  @test async mathjaxExampleFirstExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}/example/first`);
    expect(res.type).to.eql('application/json');
  }

  @test async mathjaxExampleSecondExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}/example/second`);
    expect(res.type).to.eql('application/json');
  }

  @test async mathjaxExampleThirdExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}/example/third`);
    expect(res.type).to.eql('text/html');
  }
}

@suite class CacheQuizAssetsLibRouterTestSuite {
  private _baseApiRoute = '/lib/cache/quiz/assets';

  @test async postNewAssetExists() {
    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    const res = await chai.request(router).post(`${this._baseApiRoute}/`).send({quiz});
    expect(res.type).to.eql('application/json');
  }

  @test async getByDigestExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}/7b354ef246ea570c0cc360c1eb2bda4061aec31d1012b2011077de11b9b28898`);
    expect(res.type).to.eql('text/html');
  }
}

@suite class AuthorizeLibRouterTestSuite {
  private _baseApiRoute = '/lib/authorize';

  @test async authorizeExists() {
    const res = await chai.request(router).get(`${this._baseApiRoute}`);
    expect(res.type).to.eql('text/html');
  }
}
