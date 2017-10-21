import {IQuestion} from '../interfaces/questions/interfaces';
import {calculateNumberOfAnswers} from './lib/excel_function_library';
import {IFreetextAnswerOption} from '../interfaces/answeroptions/interfaces';
import {IExcelWorksheet} from '../interfaces/excel.interfaces';
import {ExcelWorksheet} from './excel-worksheet';

export class FreeTextExcelWorksheet extends ExcelWorksheet implements IExcelWorksheet {
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
    const columnsToFormat = 4 < minColums ? minColums : 4;

    this.ws.row(1).setHeight(20);
    this.ws.column(1).setWidth(this.responsesWithConfidenceValue.length > 0 ? 40 : 30);
    this.ws.column(2).setWidth(30);
    this.ws.column(3).setWidth(35);
    this.ws.column(4).setWidth(35);

    this.ws.cell(1, 1, 1, columnsToFormat).style(defaultStyles.quizNameRowStyle);
    this.ws.cell(2, 1, 2, columnsToFormat).style(defaultStyles.exportedAtRowStyle);
    this.ws.cell(2, 2, 2, columnsToFormat).style({
      alignment: {
        horizontal: 'center'
      }
    });

    this.ws.cell(4, 1).style({
      alignment: {
        wrapText: true,
        vertical: 'top'
      }
    });
    this.ws.cell(4, 2).style({
      alignment: {
        wrapText: true,
        horizontal: 'center',
        vertical: 'center'
      },
      font: {
        color: 'FF000000'
      }
    });

    this.ws.cell(6, 1, this.responsesWithConfidenceValue.length > 0 ? 8 : 7, columnsToFormat).style(defaultStyles.statisticsRowStyle);
    this.ws.cell(6, 2, this.responsesWithConfidenceValue.length > 0 ? 8 : 7, 2).style({
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

    const hasEntries = this.quiz.nicknames.length > 0;
    const attendeeEntryRows = hasEntries ? (this.quiz.nicknames.length) : 1;
    const attendeeEntryRowStyle = hasEntries ?
                                  defaultStyles.attendeeEntryRowStyle :
                                  Object.assign({}, defaultStyles.attendeeEntryRowStyle, {
                                    alignment: {
                                      horizontal: 'center'
                                    }
                                  });
    this.ws.cell(11, 1, attendeeEntryRows + 10, columnsToFormat, !hasEntries).style(attendeeEntryRowStyle);

    this.leaderBoardData.forEach((responseItem, indexInList) => {
      let nextColumnIndex = 2;
      const targetRow = indexInList + 11;
      if (this._isCasRequired) {
        nextColumnIndex += 2;
      }
      this.ws.cell(targetRow, nextColumnIndex++).style({
        font: {
          color: 'FFFFFFFF'
        },
        fill: {
          type: 'pattern',
          patternType: 'solid',
          fgColor: responseItem.correctQuestions.length ? 'FF008000' : 'FFB22222'
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
    const answerOption = <IFreetextAnswerOption>this._question.answerOptionList[0];

    this.ws.cell(1, 1).string(`${this.mf.compile('export.question_type')}: ${this.mf.compile(`export.type.${this._question.TYPE}`)}`);
    this.ws.cell(2, 1).string(this.mf.compile('export.question'));
    this.ws.cell(2, 2).string(this.mf.compile('export.correct_value'));

    this.ws.cell(4, 1).string(this._question.questionText.replace(/[#]*[*]*/g, ''));
    this.ws.cell(4, 2).string(answerOption.answerText);

    this.ws.cell(6, 1).string(this.mf.compile('export.number_of_answers') + ':');
    this.ws.cell(6, 2).number(calculateNumberOfAnswers(this.quiz, this._questionIndex, 0));
    this.ws.cell(6, 3).string(this.mf.compile('view.answeroptions.free_text_question.config_case_sensitive') + ': ' +
                              this.mf.compile('global.' + (answerOption.configCaseSensitive ? 'yes' : 'no')));
    this.ws.cell(6, 4).string(this.mf.compile('view.answeroptions.free_text_question.config_trim_whitespaces') + ': ' +
                              this.mf.compile('global.' + (answerOption.configTrimWhitespaces ? 'yes' : 'no')));

    this.ws.cell(7, 1).string(this.mf.compile('export.percent_correct') + ':');
    const correctResponsesPercentage: number = this.leaderBoardData.length / this.quiz.nicknames.length * 100;
    this.ws.cell(7, 2).number((isNaN(correctResponsesPercentage) ? 0 : Math.round(correctResponsesPercentage)));
    this.ws.cell(7, 3).string(this.mf.compile('view.answeroptions.free_text_question.config_use_keywords') + ': ' +
                              this.mf.compile('global.' + (answerOption.configUseKeywords ? 'yes' : 'no')));
    this.ws.cell(7, 4).string(this.mf.compile('view.answeroptions.free_text_question.config_use_punctuation') + ': ' +
                              this.mf.compile('global.' + (answerOption.configUsePunctuation ? 'yes' : 'no')));

    if (this.responsesWithConfidenceValue.length > 0) {
      this.ws.cell(8, 1).string(this.mf.compile('export.average_confidence') + ':');
      let confidenceSummary = 0;
      this.quiz.nicknames.forEach((nickItem) => {
        confidenceSummary += nickItem.responses[this._questionIndex].confidence;
      });
      this.ws.cell(8, 2).number(Math.round(confidenceSummary / this.responsesWithConfidenceValue.length));
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

    let nextStartRow = 10;
    this.quiz.nicknames.forEach((nickItem) => {
      nextColumnIndex = 1;
      nextStartRow++;
      this.ws.cell(nextStartRow, nextColumnIndex++).string(nickItem.name);
      if (this._isCasRequired) {
        const profile = nickItem.casProfile;
        this.ws.cell(nextStartRow, nextColumnIndex++).string(profile.id);
        this.ws.cell(nextStartRow, nextColumnIndex++).string(profile.mail instanceof Array ? profile.mail.slice(-1)[0] : profile.mail);
      }
      this.ws.cell(nextStartRow, nextColumnIndex++).string(nickItem.responses[this._questionIndex].value);
      if (this.responsesWithConfidenceValue.length > 0) {
        this.ws.cell(nextStartRow, nextColumnIndex++).number(Math.round(nickItem.responses[this._questionIndex].confidence));
      }
      this.ws.cell(nextStartRow, nextColumnIndex++).number(nickItem.responses[this._questionIndex].responseTime);
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
