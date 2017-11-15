// Reference mocha-typescript's global definitions:
/// <reference path="../../../node_modules/mocha-typescript/globals.d.ts" />

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as i18n from 'i18n';
import {Member} from '../../quiz-manager/quiz-manager';
import {IQuestionFreetext, IQuestionGroup, IQuestionRanged, IQuestionSurvey} from '../../interfaces/questions/interfaces';
import {ExcelWorkbook} from '../../export/excel-workbook';
import {IFreetextAnswerOption} from '../../interfaces/answeroptions/interfaces';
import {QuizManagerDAO} from '../../db/QuizManagerDAO';

@suite class ExcelExportTestSuite {
  private _hashtag = 'mocha-export-test';
  private _memberCount = 20;
  private _theme = 'theme-Material';
  private _language = 'en';
  private _date: Date = new Date();
  private _dateDay = `${this._date.getDate()}_${this._date.getMonth() + 1}_${this._date.getFullYear()}`;
  private _dateFormatted = `${this._dateDay}-${this._date.getHours()}_${this._date.getMinutes()}`;
  private _exportLocation = path.join(
    __dirname, '..', '..', '..', 'test-generated', `Export-${this._hashtag}-${this._dateFormatted}.xlsx`
  );

  static before() {
    i18n.configure({
      // setup some locales - other locales default to en silently
      locales: ['en'],
      defaultLocale: 'en',

      // where to store json files - defaults to './locales' relative to modules directory
      directory: path.join(__dirname, '..', '..', '..', 'i18n'),

      // what to use as the indentation unit - defaults to "\t"
      indent: '\t',

      // setting extension of json files - defaults to '.json' (you might want to set this to '.js' according to webtranslateit)
      extension: '.json',

      // setting prefix of json files name - default to none ''
      // (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
      prefix: '',

      // enable object notation
      objectNotation: true,

      // setting of log level DEBUG - default to require('debug')('i18n:debug')
      logDebugFn: require('debug')('i18n:debug'),

      // setting of log level WARN - default to require('debug')('i18n:warn')
      logWarnFn: require('debug')('i18n:warn'),

      // setting of log level ERROR - default to require('debug')('i18n:error')
      logErrorFn: function (msg) {
        console.log('error', msg);
      },

      // object or [obj1, obj2] to bind the i18n api and current locale to - defaults to null
      register: global,

      // hash to specify different aliases for i18n's internal methods to apply on the request/response objects (method -> alias).
      // note that this will *not* overwrite existing properties with the same name
      api: {
        '__': 't',  // now req.__ becomes req.t
        '__n': 'tn' // and req.__n can be called as req.tn
      }
    });
    i18n.init({});
    const basedir = path.join(__dirname, '..', '..', '..', 'test-generated');
    if (!fs.existsSync(basedir)) {
      fs.mkdirSync(basedir);
    }
  }

  static after() {
    QuizManagerDAO.removeQuiz('mocha-export-test');
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  @test async initQuiz() {
    QuizManagerDAO.initInactiveQuiz(this._hashtag);
    await assert.equal(QuizManagerDAO.isInactiveQuiz(this._hashtag), true, 'Expected to find an inactive quiz item');

    const quiz: IQuestionGroup = JSON.parse(fs.readFileSync(
      path.join(__dirname, '..', '..', '..', 'predefined_quizzes', 'demo_quiz', 'en.demo_quiz.json')
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
      mf: i18n.__mf
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
