// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as chai from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import chaiHttp = require('chai-http');

import app from '../../App';
import QuizManagerDAO from '../../db/quiz-manager';
import {IQuestionGroup} from '../../interfaces/questions/interfaces';

chai.use(chaiHttp);
const expect = chai.expect;

const hashtag = 'mocha-test-api-v1';

@suite class LobbyApiRouterTestSuite {
  private _baseApiRoute = `/api/v1/lobby`;
  private _hashtag = hashtag;

  static after() {
    QuizManagerDAO.removeQuiz(hashtag);
  }

  @test async baseApiExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async putOpenLobby() {
    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    quiz.hashtag = this._hashtag;
    const res = await chai.request(app).put(`${this._baseApiRoute}/`).send({quiz});
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    await expect(QuizManagerDAO.isActiveQuiz(this._hashtag)).to.be.true;
  }

  @test async getLobbyData() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async putCloseLobby() {
    const res = await chai.request(app).del(`${this._baseApiRoute}/`).send({quizName: this._hashtag});
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    await expect(QuizManagerDAO.isInactiveQuiz(this._hashtag)).to.be.true;
  }
}
