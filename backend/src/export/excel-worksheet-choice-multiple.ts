import {INickname, IQuizResponse} from '../interfaces/common.interfaces';
import {ILeaderBoardItem} from '../leaderboard/leaderboard';
import {IQuestion} from '../interfaces/questions/interfaces';
import {calculateNumberOfAnswers} from './lib/excel_function_library';
import {IAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IExcelWorksheet} from '../interfaces/excel.interfaces';
import {ExcelWorksheet} from './excel-worksheet';

export class MultipleChoiceExcelWorksheet extends ExcelWorksheet implements IExcelWorksheet {
  private _isCasRequired = this.quiz.originalObject.sessionConfig.nicks.restrictToCasLogin;
  private _question: IQuestion;
  private _questionIndex: number;

  public formatSheet(): void {
    const defaultStyles = this._theme.getStyles();
    let minColums = 3;
    if (this.responsesWithConfidenceValue.length > 0) {
      minColums++;
    }
    if (this._isCasRequired) {
      minColums += 2;
    }
    const answerList = this._question.answerOptionList;
    const columnsToFormat: number = answerList.length + 1 < minColums ? minColums : answerList.length + 1;
    const answerCellStyle: Object = {
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      font: {
        color: 'FFFFFFFF'
      }
    };

    this.ws.row(1).setHeight(20);
    this.ws.column(1).setWidth(this.responsesWithConfidenceValue.length > 0 ? 40 : 30);
    for (let j = 2; j <= columnsToFormat; j++) {
      this.ws.column(j).setWidth(20);
    }

    this.ws.cell(1, 1, 1, columnsToFormat).style(defaultStyles.quizNameRowStyle);
    this.ws.cell(2, 1, 2, columnsToFormat).style(defaultStyles.exportedAtRowStyle);
    this.ws.cell(2, 2, 2, columnsToFormat).style({
      alignment: {
        horizontal: 'center'
      }
    });

    this.ws.cell(4, 1).style(defaultStyles.questionCellStyle);
    for (let j = 0; j < answerList.length; j++) {
      const targetColumn: number = j + 2;
      this.ws.cell(4, targetColumn).style(Object.assign({}, answerCellStyle, {
        border: {
          right: {
            style: (targetColumn <= answerList.length) ? 'thin' : 'none',
            color: 'black'
          }
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: answerList[j].isCorrect ? 'FF008000' : 'FFB22222'
        }
      }));
    }

    this.ws.cell(6, 1, this.responsesWithConfidenceValue.length > 0 ? 8 : 7, columnsToFormat).style(defaultStyles.statisticsRowStyle);
    this.ws.cell(6, 2, this.responsesWithConfidenceValue.length > 0 ? 8 : 7, columnsToFormat).style({
      alignment: {
        horizontal: 'center'
      }
    });

    this.ws.cell(10, 1, 10, columnsToFormat).style(defaultStyles.attendeeHeaderRowStyle);
    this.ws.cell(10, 1).style({
      alignment: {
        horizontal: 'left'
      }
    });

    this.ws.row(10).filter({
      firstRow: 10,
      firstColumn: 1,
      lastRow: 10,
      lastColumn: minColums
    });

    const responses = this.quiz.nicknames.map(nickname => nickname.responses[this._questionIndex]);
    const hasEntries: boolean = responses.length > 0;
    const attendeeEntryRows: number = hasEntries ? (responses.length) : 1;
    const attendeeEntryRowStyle: Object = hasEntries ?
                                          defaultStyles.attendeeEntryRowStyle :
                                          Object.assign({}, defaultStyles.attendeeEntryRowStyle, {
                                            alignment: {
                                              horizontal: 'center'
                                            }
                                          });
    this.ws.cell(11, 1, attendeeEntryRows + 10, columnsToFormat, !hasEntries).style(attendeeEntryRowStyle);

    responses.forEach((responseItem: IQuizResponse, indexInList: number): void => {
      let nextColumnIndex = 3;
      const targetRow: number = indexInList + 11;
      if (this._isCasRequired) {
        nextColumnIndex += 2;
      }
      if (this.responsesWithConfidenceValue.length > 0) {
        this.ws.cell(targetRow, nextColumnIndex++).style({
          alignment: {
            horizontal: 'center'
          }
        });
      }
      this.ws.cell(targetRow, nextColumnIndex).style({
        alignment: {
          horizontal: 'center'
        },
        numberFormat: '#,##0;'
      });
    });
  }

  public addSheetData(): void {
    const answerList = this._question.answerOptionList;

    this.ws.cell(1, 1).string(`${this.mf.compile('export.question_type')}: ${this.mf.compile(`export.type.${this._question.TYPE}`)}`);
    this.ws.cell(2, 1).string(this.mf.compile('export.question'));
    this.ws.cell(6, 1).string(this.mf.compile('export.number_of_answers') + ':');
    this.ws.cell(7, 1).string(this.mf.compile('export.percent_correct') + ':');
    const correctResponsesPercentage: number = this.leaderBoardData.length / this.quiz.nicknames.length * 100;
    this.ws.cell(7, 2).number((isNaN(correctResponsesPercentage) ? 0 : Math.round(correctResponsesPercentage)));
    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(8, 1).string(this.mf.compile('export.average_confidence') + ':');
      let confidenceSummary = 0;
      this.quiz.nicknames.forEach((nickname: INickname) => {
        confidenceSummary += nickname.responses[this._questionIndex].confidence;
      });
      this.ws.cell(8, 2).number(Math.round((confidenceSummary / this.responsesWithConfidenceValue.length)));
    }
    this.ws.cell(4, 1).string(this._question.questionText.replace(/[#]*[*]*/g, ''));
    for (let j = 0; j < answerList.length; j++) {
      this.ws.cell(2, (j + 2)).string(this.mf.compile('export.answer') + ' ' + (j + 1));
      this.ws.cell(4, (j + 2)).string(answerList[j].answerText);
      this.ws.cell(6, (j + 2)).number(calculateNumberOfAnswers(this.quiz, this._questionIndex, j));
    }
    let nextColumnIndex = 1;
    this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.attendee'));
    if (this._isCasRequired) {
      this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.cas_account_id'));
      this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.cas_account_email'));
    }
    this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.answer'));
    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.confidence_level'));
    }
    this.ws.cell(10, nextColumnIndex++).string(this.mf.compile('export.time'));

    const sortedResponses: Array<ILeaderBoardItem> = this.leaderBoardData.sort(
      (response: ILeaderBoardItem, previous: ILeaderBoardItem): 1 | 0 | -1 => {
        return response.responseTime > previous.responseTime ? 1 : response.responseTime < previous.responseTime ? -1 : 0;
      }
    );
    let nextStartRow = 10;
    sortedResponses.forEach((leaderboardItem: ILeaderBoardItem): void => {
      nextColumnIndex = 1;
      nextStartRow++;
      this.ws.cell(nextStartRow, nextColumnIndex++).string(leaderboardItem.name);
      if (this._isCasRequired) {
        const profile = this.quiz.nicknames.filter((nick: INickname) => {
          return nick.name === leaderboardItem.name;
        })[0].casProfile;
        this.ws.cell(nextStartRow, nextColumnIndex++).string(profile.id);
        this.ws.cell(nextStartRow, nextColumnIndex++).string(profile.mail instanceof Array ? profile.mail.slice(-1)[0] : profile.mail);
      }
      const nickItem = this.quiz.nicknames.filter(nick => nick.name === leaderboardItem.name)[0];
      const chosenAnswer = this._question.answerOptionList.filter((answer, index) => {
        const responseValue = nickItem.responses[this._questionIndex].value;
        if (responseValue instanceof Array) {
          return responseValue.indexOf(index) > -1;
        }
        return null;
      });
      const chosenAnswerString: Array<any> = [];
      chosenAnswer.forEach((chosenAnswerItem: IAnswerOption): void => {
        chosenAnswerString.push({color: chosenAnswerItem.isCorrect ? 'FF008000' : 'FFB22222'});
        chosenAnswerString.push(chosenAnswerItem.answerText);
        chosenAnswerString.push({color: 'FF000000'});
        chosenAnswerString.push(', ');
      });
      chosenAnswerString.pop();
      this.ws.cell(nextStartRow, nextColumnIndex++).string(chosenAnswerString);
      if (this.responsesWithConfidenceValue.length > 0) {
        this.ws.cell(nextStartRow, nextColumnIndex++).number(Math.round(leaderboardItem.confidenceValue));
      }
      this.ws.cell(nextStartRow, nextColumnIndex++).number(leaderboardItem.responseTime);
    });
    if (nextStartRow === 10) {
      this.ws.cell(11, 1).string(this.mf.compile('export.attendee_complete_correct_none_available'));
    }
  }

  constructor({wb, theme, translation, quiz, mf, questionIndex}) {
    super({theme, translation, quiz, mf, questionIndex});
    this._ws = wb.addWorksheet(`${mf.compile('export.question')} ${questionIndex + 1}`, this._options);
    this._questionIndex = questionIndex;
    this._question = this.quiz.originalObject.questionList[questionIndex];
    this.formatSheet();
    this.addSheetData();
  }
}