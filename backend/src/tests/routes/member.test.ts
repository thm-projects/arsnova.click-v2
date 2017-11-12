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

const hashtag = 'mocha-test-api-v1-member';

@suite class MemberApiRouterTestSuite {
  private _baseApiRoute = `/api/v1/member`;
  private _hashtag = hashtag;
  private _nickname = 'testNickname';

  static after() {
    QuizManagerDAO.removeQuiz(hashtag);
  }

  @test async baseApiExists() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async bootstrapQuiz() {
    QuizManagerDAO.initInactiveQuiz(this._hashtag);
    await expect(QuizManagerDAO.isInactiveQuiz(this._hashtag)).to.be.true;

    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    quiz.hashtag = this._hashtag;
    QuizManagerDAO.initActiveQuiz(quiz);

    await expect(QuizManagerDAO.isActiveQuiz(this._hashtag)).to.be.true;
  }

  @test async getAllMembers() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/${this._hashtag}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async getRemainingNicks() {
    const res = await chai.request(app).get(`${this._baseApiRoute}/${this._hashtag}/available`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async addMember() {
    const res = await chai.request(app).put(`${this._baseApiRoute}/`).send({
      quizName: this._hashtag,
      nickname: this._nickname
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
    expect(QuizManagerDAO.getActiveQuizByName(this._hashtag).nextQuestion()).to.equal(0);
  }

  @test async addReadingConfirmation() {
    const res = await chai.request(app).put(`${this._baseApiRoute}/reading-confirmation`).send({
      quizName: this._hashtag,
      nickname: this._nickname
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async addConfidenceValue() {
    const res = await chai.request(app).put(`${this._baseApiRoute}/confidence-value`).send({
      quizName: this._hashtag,
      nickname: this._nickname,
      confidenceValue: 100
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async addResponse() {
    const res = await chai.request(app).put(`${this._baseApiRoute}/response`).send({
      quizName: this._hashtag,
      nickname: this._nickname,
      value: [0]
    });
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }

  @test async deleteMember() {
    const res = await chai.request(app).del(`${this._baseApiRoute}/${this._hashtag}/${this._nickname}`);
    expect(res.status).to.equal(200);
    expect(res.type).to.equal('application/json');
  }
}
