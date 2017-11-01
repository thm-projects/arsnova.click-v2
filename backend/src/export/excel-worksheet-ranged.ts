import {INickname} from '../interfaces/common.interfaces';
import {IQuestion, IQuestionRanged} from '../interfaces/questions/interfaces';
import {calculateNumberOfRangedAnswers} from './lib/excel_function_library';
import {IExcelWorksheet} from '../interfaces/excel.interfaces';
import {ExcelWorksheet} from './excel-worksheet';

export class RangedExcelWorksheet extends ExcelWorksheet implements IExcelWorksheet {
  private _isCasRequired = this.quiz.originalObject.sessionConfig.nicks.restrictToCasLogin;
  private _question: IQuestion;
  private _questionIndex: number;

  public formatSheet(): void {
    const defaultStyles = this._theme.getStyles();
    const answerCellStyle = {
      alignment: {
        vertical: 'center',
        horizontal: 'center'
      },
      font: {
        color: 'FF000000'
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: 'FFFFE200'
      }
    };
    let minColums = 3;
    if (this.responsesWithConfidenceValue.length > 0) {
      minColums++;
    }
    if (this._isCasRequired) {
      minColums += 2;
    }
    const columnsToFormat = 4 < minColums ? minColums : 4;

    this.ws.row(1).setHeight(20);
    this.ws.column(1).setWidth(this.responsesWithConfidenceValue.length > 0 ? 40 : 30);
    this.ws.column(2).setWidth(20);
    this.ws.column(3).setWidth(20);
    this.ws.column(4).setWidth(20);

    this.ws.cell(1, 1, 1, columnsToFormat).style(defaultStyles.quizNameRowStyle);
    this.ws.cell(2, 1, 2, columnsToFormat).style(defaultStyles.exportedAtRowStyle);
    this.ws.cell(2, 2, 2, columnsToFormat).style({
      alignment: {
        horizontal: 'center'
      }
    });

    this.ws.cell(4, 1).style(defaultStyles.questionCellStyle);
    this.ws.cell(4, 2).style(Object.assign({}, answerCellStyle, {
      border: {
        right: {
          style: 'thin',
          color: 'black'
        }
      }
    }));
    this.ws.cell(4, 3).style(Object.assign({}, answerCellStyle, {
      border: {
        right: {
          style: 'thin',
          color: 'black'
        }
      },
      font: {
        color: 'FFFFFFFF'
      },
      fill: {
        type: 'pattern',
        patternType: 'solid',
        fgColor: 'FF008000'
      }
    }));
    this.ws.cell(4, 4).style(answerCellStyle);

    this.ws.cell(6, 1, this.responsesWithConfidenceValue.length > 0 ? 8 : 7, columnsToFormat).style(defaultStyles.statisticsRowStyle);
    this.ws.cell(6, 2).style(Object.assign({}, defaultStyles.statisticsRowInnerStyle, {
      alignment: {
        horizontal: 'center'
      }
    }));
    this.ws.cell(6, 3).style(Object.assign({}, defaultStyles.statisticsRowInnerStyle, {
      alignment: {
        horizontal: 'center'
      }
    }));
    this.ws.cell(6, 4).style(Object.assign({}, defaultStyles.statisticsRowInnerStyle, {
      alignment: {
        horizontal: 'center'
      }
    }));

    this.ws.cell(7, 1).style(defaultStyles.statisticsRowInnerStyle);
    this.ws.cell(7, 2).style(Object.assign({}, defaultStyles.statisticsRowInnerStyle, {
      alignment: {
        horizontal: 'center'
      }
    }));
    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(8, 1).style(defaultStyles.statisticsRowInnerStyle);
      this.ws.cell(8, 2).style(Object.assign({}, defaultStyles.statisticsRowInnerStyle, {
        alignment: {
          horizontal: 'center'
        }
      }));
    }

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

    const hasEntries = this.leaderBoardData.length > 0;
    const attendeeEntryRows = hasEntries ? (this.leaderBoardData.length) : 1;
    const attendeeEntryRowStyle = hasEntries ?
                                  defaultStyles.attendeeEntryRowStyle :
                                  Object.assign({}, defaultStyles.attendeeEntryRowStyle, {
                                    alignment: {
                                      horizontal: 'center'
                                    }
                                  });
    this.ws.cell(11, 1, attendeeEntryRows + 10, columnsToFormat, !hasEntries).style(attendeeEntryRowStyle);

    this.leaderBoardData.forEach((leaderboardItem, indexInList) => {
      let nextColumnIndex = 2;
      const targetRow = indexInList + 11;
      if (this._isCasRequired) {
        nextColumnIndex += 2;
      }
      const responseItem = this.quiz.nicknames.filter(nickitem => nickitem.name === leaderboardItem.name)[0].responses[this._questionIndex];
      const castedQuestion = <IQuestionRanged>this._question;
      this.ws.cell(targetRow, nextColumnIndex++).style({
        alignment: {
          horizontal: 'center'
        },
        font: {
          color: responseItem.value === castedQuestion.correctValue ||
                 responseItem.value < castedQuestion.rangeMin ||
                 responseItem.value > castedQuestion.rangeMax ? 'FFFFFFFF' : 'FF000000'
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: responseItem.value === castedQuestion.correctValue ? 'FF008000'
            : responseItem.value < castedQuestion.rangeMin ||
              responseItem.value > castedQuestion.rangeMax ? 'FFB22222' : 'FFFFE200'
        }
      });
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
    const castedQuestion = <IQuestionRanged>this._question;
    const numberOfInputValuesPerGroup = calculateNumberOfRangedAnswers(
      this.quiz,
      this._questionIndex,
      castedQuestion.rangeMin,
      castedQuestion.correctValue,
      castedQuestion.rangeMax
    );

    this.ws.cell(1, 1).string(`${this.mf('export.question_type')}: ${this.mf(`export.type.${this._question.TYPE}`)}`);
    this.ws.cell(2, 1).string(this.mf('export.question'));

    this.ws.cell(2, 2).string(this.mf('export.min_range'));
    this.ws.cell(2, 3).string(this.mf('export.correct_value'));
    this.ws.cell(2, 4).string(this.mf('export.max_range'));

    this.ws.cell(4, 1).string(castedQuestion.questionText.replace(/[#]*[*]*/g, ''));
    this.ws.cell(4, 2).number(castedQuestion.rangeMin);
    this.ws.cell(4, 3).number(castedQuestion.correctValue);
    this.ws.cell(4, 4).number(castedQuestion.rangeMax);

    this.ws.cell(6, 1).string(`${this.mf('export.number_of_answers')}:`);
    this.ws.cell(6, 2).number(numberOfInputValuesPerGroup.minRange);
    this.ws.cell(6, 3).number(numberOfInputValuesPerGroup.correctValue);
    this.ws.cell(6, 4).number(numberOfInputValuesPerGroup.maxRange);

    this.ws.cell(7, 1).string(this.mf('export.percent_correct') + ':');
    const correctResponsesPercentage: number = this.leaderBoardData.length / this.quiz.nicknames.length * 100;
    this.ws.cell(7, 2).number((isNaN(correctResponsesPercentage) ? 0 : Math.round(correctResponsesPercentage)));

    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(8, 1).string(this.mf('export.average_confidence') + ':');
      let confidenceSummary = 0;
      this.quiz.nicknames.forEach((nickItem) => {
        confidenceSummary += nickItem.responses[this._questionIndex].confidence;
      });
      this.ws.cell(8, 2).number(Math.round(confidenceSummary / this.responsesWithConfidenceValue.length));
    }

    let nextColumnIndex = 1;
    this.ws.cell(10, nextColumnIndex++).string(this.mf('export.attendee'));
    if (this._isCasRequired) {
      this.ws.cell(10, nextColumnIndex++).string(this.mf('export.cas_account_id'));
      this.ws.cell(10, nextColumnIndex++).string(this.mf('export.cas_account_email'));
    }
    this.ws.cell(10, nextColumnIndex++).string(this.mf('export.answer'));
    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(10, nextColumnIndex++).string(this.mf('export.confidence_level'));
    }
    this.ws.cell(10, nextColumnIndex++).string(this.mf('export.time'));

    let nextStartRow = 10;
    this.leaderBoardData.forEach((leaderboardItem) => {
      const responseItem = this.quiz.nicknames.filter(nickitem => nickitem.name === leaderboardItem.name)[0].responses[this._questionIndex];

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
      this.ws.cell(nextStartRow, nextColumnIndex++).number(responseItem.value);
      if (this.responsesWithConfidenceValue.length > 0) {
        this.ws.cell(nextStartRow, nextColumnIndex++).number(Math.round(leaderboardItem.confidenceValue));
      }
      this.ws.cell(nextStartRow, nextColumnIndex++).number(leaderboardItem.responseTime);
    });
    if (nextStartRow === 10) {
      this.ws.cell(11, 1).string(this.mf('export.attendee_complete_correct_none_available'));
    }
  }

  constructor({wb, theme, translation, quiz, mf, questionIndex}) {
    super({theme, translation, quiz, mf, questionIndex});
    this._ws = wb.addWorksheet(`${mf('export.question')} ${questionIndex + 1}`, this._options);
    this._questionIndex = questionIndex;
    this._question = this.quiz.originalObject.questionList[questionIndex];
    this.formatSheet();
    this.addSheetData();
  }
}
