import * as xlsx from 'excel4node';
import * as MessageFormat from 'messageformat';

import {ExcelTheme} from './lib/excel_default_styles';
import {excelDefaultWorksheetOptions} from './lib/excel_default_options';
import {IActiveQuiz, INickname} from '../interfaces/common.interfaces';
import {ILeaderBoardItem, Leaderboard} from '../leaderboard/leaderboard';
import {IQuestion} from '../interfaces/questions/interfaces';

export abstract class ExcelWorksheet {
  get responsesWithConfidenceValue(): Array<INickname> {
    return this._responsesWithConfidenceValue;
  }
  get leaderBoardData(): Array<ILeaderBoardItem> {
    return this._leaderBoardData;
  }
  get columnsToFormat(): number {
    return this._columnsToFormat;
  }
  get quiz(): IActiveQuiz {
    return this._quiz;
  }
  get createdAt(): string {
    return this._createdAt;
  }
  get mf(): MessageFormat {
    return this._mf;
  }
  get ws(): xlsx.Worksheet {
    return this._ws;
  }
  private _mf: MessageFormat;
  private _createdAt: string;
  private _quiz: IActiveQuiz;
  private _columnsToFormat: number;
  private _leaderBoardData: Array<ILeaderBoardItem>;
  private _responsesWithConfidenceValue: Array<INickname>;

  protected _ws: xlsx.Worksheet;
  protected _options: Object;
  protected _theme: ExcelTheme;
  protected _translation: string;

  constructor(
    {theme, translation, quiz, mf, questionIndex}:
      {theme: ExcelTheme, translation: string, quiz: IActiveQuiz, mf: MessageFormat, questionIndex?: number}) {
    this._theme = theme;
    this._translation = translation;
    this._quiz = quiz;
    this._mf = mf;
    this._createdAt = this.generateCreatedAtString();
    this._options = Object.assign({}, excelDefaultWorksheetOptions, {
      headerFooter: {
        firstHeader: mf('export.page_header', {createdAt: this._createdAt}),
        firstFooter: mf('export.page_footer'),
        evenHeader: mf('export.page_header', {createdAt: this._createdAt}),
        evenFooter: mf('export.page_footer'),
        oddHeader: mf('export.page_header', {createdAt: this._createdAt}),
        oddFooter: mf('export.page_footer'),
        alignWithMargins: true,
        scaleWithDoc: false
      }
    });

    this._columnsToFormat = 4;
    this._responsesWithConfidenceValue = this._quiz.nicknames.filter(nickname => {
      return nickname.responses.filter(response => {
        return response.confidence > -1;
      }).length;
    });
    if (this._responsesWithConfidenceValue.length > 0) {
      this._columnsToFormat++;
    }
    if (this._quiz.originalObject.sessionConfig.nicks.restrictToCasLogin) {
      this._columnsToFormat += 2;
    }

    this._leaderBoardData = this.getLeaderboardData(questionIndex);
  }

  private prefixNumberWithZero(num: number): string {
    return `${num < 10 ? '0' : ''}${num}`;
  }

  protected generateCreatedAtString(): string {
    const date = new Date();
    return `${this.prefixNumberWithZero(date.getDate())}.
            ${this.prefixNumberWithZero(date.getMonth() + 1)}.
            ${date.getFullYear()} ${this._mf('export.exported_at')} ${this.prefixNumberWithZero(date.getHours())}:
            ${this.prefixNumberWithZero(date.getMinutes())} ${this._mf('export.exported_at_time')}`;
  }

  private getLeaderboardData(questionIndex: number): Array<ILeaderBoardItem> {
    const leaderBoard = new Leaderboard();
    const questionAmount: number = this.quiz.originalObject.questionList.length;
    const endIndex: number = questionIndex < 0 ? questionAmount : questionIndex === questionAmount ? questionAmount : questionIndex + 1;
    const correctResponses: any = {};

    if (questionIndex < 0) {
      questionIndex = 0;
    }

    this.quiz.nicknames.forEach(attendee => {
      for (let i: number = questionIndex; i < endIndex; i++) {
        const question: IQuestion = this.quiz.originalObject.questionList[i];
        if (['SurveyQuestion', 'ABCDSingleChoiceQuestion'].indexOf(question.TYPE)) {
          continue;
        }
        console.log('leaderboard export', i, attendee.responses[i], question);
        if (leaderBoard.isCorrectResponse(attendee.responses[i], question) === 1) {
          if (!correctResponses[attendee.name]) {
            correctResponses[attendee.name] = {responseTime: 0, correctQuestions: [], confidenceValue: 0};
          }
          correctResponses[attendee.name].responseTime += <number>attendee.responses[i].responseTime;
          correctResponses[attendee.name].correctQuestions.push(i);
          correctResponses[attendee.name].confidenceValue += <number>attendee.responses[i].confidence;
        } else {
          delete correctResponses[attendee.name];
          break;
        }
      }
    });

    return leaderBoard.objectToArray(correctResponses);
  }
}
