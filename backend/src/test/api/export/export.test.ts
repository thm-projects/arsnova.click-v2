// Reference mocha-typescript's global definitions:
/// <reference path="../../../../node_modules/mocha-typescript/globals.d.ts" />

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import QuizManagerDAO, {Member} from '../../../db/quiz-manager';
import {IQuestionFreetext, IQuestionGroup, IQuestionRanged, IQuestionSurvey} from '../../../interfaces/questions/interfaces';
import {ExcelWorkbook} from '../../../export/excel-workbook';
import {IFreetextAnswerOption} from '../../../interfaces/answeroptions/interfaces';

@suite class ExcelExportSuite {
  private _hashtag = 'mocha-export-test';
  private _memberCount = 20;
  private _theme = 'theme-Material';
  private _language = 'en';
  private _date: Date = new Date();
  private _dateDay = `${this._date.getDate()}_${this._date.getMonth() + 1}_${this._date.getFullYear()}`;
  private _dateFormatted = `${this._dateDay}-${this._date.getHours()}_${this._date.getMinutes()}`;
  private _exportLocation = path.join(
    __dirname, '..', '..', '..', '..', 'test-generated', `Export-${this._hashtag}-${this._dateFormatted}.xlsx`
  );

  static before() {
    const basedir = path.join(__dirname, '..', '..', '..', '..', 'test-generated');
    if (!fs.existsSync(basedir)) {
      fs.mkdirSync(basedir);
    }
  }

  static after() {
    QuizManagerDAO.removeQuiz('mocha:export-test');
  }

  private _mfInstance = key => key; // Simply return the MessageFormat key - don't parse it

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  @test async initQuiz() {
    QuizManagerDAO.initInactiveQuiz(this._hashtag, Math.random().toString(10));
    await assert.equal(QuizManagerDAO.isInactiveQuiz(this._hashtag), true, 'Expected to find an inactive quiz item');

    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
    ).toString('UTF-8'));
    quiz.hashtag = this._hashtag;
    QuizManagerDAO.initActiveQuiz(quiz);

    await assert.equal(QuizManagerDAO.isActiveQuiz(this._hashtag), true, 'Expected to find an active quiz item');
  }

  @test async addMembers() {
    const quiz = QuizManagerDAO.getActiveQuizByName(this._hashtag);
    for (let memberIndex = 0; memberIndex < this._memberCount; memberIndex++) {
      quiz.nicknames.push(
        new Member({id: memberIndex, name: `testnick${memberIndex + 1}`, webSocketAuthorization: 0, responses: []}),
      );
    }
    await assert.equal(quiz.nicknames.length, this._memberCount, `Expected that the quiz has ${this._memberCount} members`);
  }

  @test async addResponses() {
    const quiz = QuizManagerDAO.getActiveQuizByName(this._hashtag);
    for (let questionIndex = 0; questionIndex < quiz.originalObject.questionList.length; questionIndex++) {
      const question = quiz.originalObject.questionList[questionIndex];
      for (let memberIndex = 0; memberIndex < this._memberCount; memberIndex++) {
        let value;
        let parsedQuestion;
        let useCorrect;
        switch (question.TYPE) {
          case 'YesNoSingleChoiceQuestion':
          case 'TrueFalseSingleChoiceQuestion':
            value = [this.randomIntFromInterval(0, 1)];
            break;
          case 'SurveyQuestion':
            parsedQuestion = (<IQuestionSurvey>question);
            if (parsedQuestion.multipleSelectionEnabled) {
              value = [];
              for (let i = 0; i < 3; i++) {
                const generatedValue = this.randomIntFromInterval(0, question.answerOptionList.length - 1);
                if (value.indexOf(generatedValue) > -1) {
                  continue;
                }
                value.push(generatedValue);
              }
            } else {
              value = [this.randomIntFromInterval(0, question.answerOptionList.length - 1)];
            }
            break;
          case 'SingleChoiceQuestion':
          case 'ABCDSingleChoiceQuestion':
            value = [this.randomIntFromInterval(0, question.answerOptionList.length - 1)];
            break;
          case 'MultipleChoiceQuestion':
            value = [];
            for (let i = 0; i < 3; i++) {
              const generatedValue = this.randomIntFromInterval(0, question.answerOptionList.length - 1);
              if (value.indexOf(generatedValue) > -1) {
                continue;
              }
              value.push(generatedValue);
            }
            break;
          case 'RangedQuestion':
            parsedQuestion = (<IQuestionRanged>question);
            useCorrect = Math.random() > 0.5;
            if (useCorrect) {
              value = parsedQuestion.correctValue;
            } else {
              value = this.randomIntFromInterval(parsedQuestion.rangeMin, parsedQuestion.rangeMax);
            }
            break;
          case 'FreeTextQuestion':
            const parsedAnswer: IFreetextAnswerOption = <IFreetextAnswerOption>(<IQuestionFreetext>question).answerOptionList[0];
            useCorrect = Math.random() > 0.5;
            if (useCorrect) {
              value = parsedAnswer.answerText;
            } else {
              value = parsedAnswer.answerText.split('').reverse().join('');
            }
            break;
          default:
            throw new Error(`Unsupported question type ${question.TYPE}`);
        }
        quiz.nicknames[memberIndex].responses.push({
          value: value,
          responseTime: this.randomIntFromInterval(0, quiz.originalObject.questionList[questionIndex].timer),
          confidence: this.randomIntFromInterval(0, 100),
          readingConfirmation: true
        });
      }
    }
  }

  @test(slow(500)) async generateExcelWorkbook() {
    const quiz = QuizManagerDAO.getActiveQuizByName(this._hashtag);
    const wb = new ExcelWorkbook({
      themeName: this._theme,
      translation: this._language,
      quiz: quiz,
      mf: this._mfInstance
    });

    const buffer = await wb.writeToBuffer();
    fs.open(this._exportLocation, 'w', (err, fd) => {
      if (err) {
        throw new Error('error opening file: ' + err);
      }

      fs.write(fd, buffer, 0, buffer.length, null, (error) => {
        if (error) {
          throw new Error('error writing file: ' + error);
        }
        fs.closeSync(fd);
      });
    });
  }

  @test async checkWorkbookExisting() {
    await assert.ok(
      fs.readFileSync(this._exportLocation),
      'Expected Excel workbook to exist'
    );
  }
}
