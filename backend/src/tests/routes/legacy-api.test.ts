// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');

import app from '../../App';
import {IQuestionGroup} from '../../interfaces/questions/interfaces';
import {DatabaseTypes, DbDao} from '../../db/DbDAO';
import {staticStatistics} from '../../statistics';
import {QuizManagerDAO} from '../../db/QuizManagerDAO';

chai.use(chaiHttp);
const expect = chai.expect;

const hashtag = 'mocha-legacy-api-test';
const privateKey = Math.random().toString(10);

@suite class LegacyApiRouterTestSuite {
  private _baseApiRoute = `${staticStatistics.routePrefix}/api`;
  private _hashtag = hashtag;
  private _privateKey = privateKey;

  static after() {
    QuizManagerDAO.removeQuiz(hashtag);
    DbDao.delete(DatabaseTypes.quiz, {quizName: hashtag, privateKey: privateKey});
  }

  @test async baseApiExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}`);
    await expect(res.status).to.equal(200);
    await expect(res.type).to.equal('application/json');
  }

  @test async keepalive() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/keepalive`);
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.equal('Ok');
  }

  @test async addHashtag() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/addHashtag`).send({
      sessionConfiguration: {hashtag: this._hashtag, privateKey: this._privateKey}
    });
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.equal('Hashtag successfully created');
    await expect(QuizManagerDAO.isInactiveQuiz(this._hashtag)).to.be.true;
  }

  @test async createPrivateKey() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/createPrivateKey`);
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.be.a('string');
  }

  @test async openSession() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/openSession`).send({
      sessionConfiguration: {hashtag: this._hashtag, privateKey: this._privateKey}
    });
    await expect(res.status).to.equal(200);
  }

  @test async updateQuestionGroup() {
    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    quiz.hashtag = this._hashtag;
    const res = await chai.request(app).post(`${this._baseApiRoute}/updateQuestionGroup`).send({
      questionGroupModel: quiz
    });
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.equal(`Session with hashtag ${this._hashtag} successfully updated`);
    await expect(QuizManagerDAO.isActiveQuiz(this._hashtag)).to.be.true;
  }

  @test async showReadingConfirmation() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/showReadingConfirmation`).send({
      sessionConfiguration: {hashtag: this._hashtag, privateKey: this._privateKey}
    });
    await expect(res.status).to.equal(200);
  }

  @test async startNextQuestion() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/startNextQuestion`).send({
      sessionConfiguration: {hashtag: this._hashtag, questionIndex: 0}
    });
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.equal(`Next Question with index 0 started.`);
    await expect(QuizManagerDAO.getActiveQuizByName(this._hashtag).currentQuestionIndex).to.equal(0);
  }

  @test async removeLocalData() {
    const res = await chai.request(app).post(`${this._baseApiRoute}/removeLocalData`).send({
      sessionConfiguration: {hashtag: this._hashtag, privateKey: this._privateKey}
    });
    await expect(res.status).to.equal(200);
    await expect(res['text']).to.equal('Session successfully removed');
    await expect(QuizManagerDAO.isInactiveQuiz(this._hashtag)).to.be.true;
  }
}
