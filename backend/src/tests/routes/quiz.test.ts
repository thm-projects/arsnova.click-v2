// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');

import app from '../../App';
import {DatabaseTypes, DbDao} from '../../db/DbDAO';
import {IQuestionGroup} from '../../interfaces/questions/interfaces';
import {staticStatistics} from '../../statistics';
import {QuizManagerDAO} from '../../db/QuizManagerDAO';

chai.use(chaiHttp);
const expect = chai.expect;

const hashtag = 'mocha-test-api-v1';
const privateKey = Math.random().toString(10);

@suite class QuizApiRouterTestSuite {
  private _baseApiRoute = `${staticStatistics.routePrefix}/api/v1/quiz`;
  private _hashtag = hashtag;
  private _privateKey = privateKey;

  static after() {
    QuizManagerDAO.removeQuiz(hashtag);
    DbDao.delete(DatabaseTypes.quiz, {quizName: hashtag, privateKey: privateKey});
  }

  @test async baseApiExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async generateDemoQuiz() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/generate/demo/en`);
    expect(res.type).to.equal('application/json');
    expect(res.status).to.equal(200);
    expect(res.body.hashtag).to.equal('Demo Quiz ' + (QuizManagerDAO.getAllPersistedDemoQuizzes().length + 1));
  }

  @test async generateAbcdQuiz() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/generate/abcd/en/5`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async getStatusWhenUndefined() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/status/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(res.body.step).to.equal('QUIZ:UNDEFINED');
  }

  @test async reserve() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/reserve`).send({
      quizName: this._hashtag,
      privateKey: this._privateKey,
      serverPassword: 'abc'
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    await expect(QuizManagerDAO.isInactiveQuiz(this._hashtag)).to.be.true;
  }

  @test async getStatusWhenExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/status/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(res.body.step).to.equal('QUIZ:EXISTS');
  }

  @test async getStatusWhenAvailable() {
    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    quiz.hashtag = this._hashtag;
    QuizManagerDAO.initActiveQuiz(quiz);
    const res = await chai.request(app).get(`${this._baseApiRoute}/status/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(res.body.step).to.equal('QUIZ:AVAILABLE');
  }

  @test async getCurrentState() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/currentState/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async getStartTime() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/currentState/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async getSettings() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/settings/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async upload() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/upload`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async start() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/start`).send({
      quizName: this._hashtag
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async stop() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/stop`).send({
      quizName: this._hashtag
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async readingConfirmation() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/reading-confirmation`).send({
      quizName: this._hashtag
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async updateSettings() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/settings/update`).send({
      quizName: this._hashtag,
      target: 'reading-confirmation',
      state: true
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async reset() {
    const res = await chai.request(app).patch(`${this._baseApiRoute}/reset/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async deleteActiveQuiz() {
    const res = await chai.request(app).del(`${this._baseApiRoute}/active`).send({
      quizName: this._hashtag,
      privateKey: this._privateKey
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async deleteQuiz() {
    const res = await chai.request(app).del(`${this._baseApiRoute}/`).send({
      quizName: this._hashtag,
      privateKey: this._privateKey
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }
}
