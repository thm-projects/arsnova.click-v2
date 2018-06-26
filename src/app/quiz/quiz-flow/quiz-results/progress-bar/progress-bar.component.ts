import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IFreetextAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/interfaces';
import { IQuestion } from 'arsnova-click-v2-types/src/questions/interfaces';
import { FreeTextQuestion } from 'arsnova-click-v2-types/src/questions/question_freetext';
import { RangedQuestion } from 'arsnova-click-v2-types/src/questions/question_ranged';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { CurrentQuizService } from '../../../../service/current-quiz/current-quiz.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { NUMBER_TYPE } from '../../../../shared/enums';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  public static TYPE = 'ProgressBarComponent';

  @Input() public data: Array<string>;
  @Input() public questionIndex: number;
  @Input() public question: IQuestion;
  @Input() public hideProgressbarCssStyle: boolean;

  constructor(
    private attendeeService: AttendeeService,
    private translate: TranslateService,
    private currentQuizService: CurrentQuizService,
    private i18nService: I18nService,
  ) {
  }

  public attendeeDataForAnswer(answerIndex: number): Object {
    const question = this.currentQuizService.quiz.questionList[this.questionIndex];
    const result = {
      answerIndex: answerIndex,
      label: this.data[answerIndex],
      absolute: 0,
      base: this.attendeeService.attendees.length,
      percent: '0',
      isCorrect: 0,
    };

    if (question instanceof RangedQuestion) {
      this.updateResultSetForRangedQuestions(result, question);
    } else if (question instanceof FreeTextQuestion) {
      this.updateResultSetForFreetextQuestions(result, question);
    } else {
      this.updateResultSetForQuestions(result, question, answerIndex);
    }

    if (this.hideProgressbarCssStyle) {
      delete result.isCorrect;
    }

    return result;
  }

  private async updateResultSetForQuestions(result, question, answerIndex): Promise<void> {
    const matches = this.attendeeService.attendees.filter(value => {
      if (typeof value.responses[this.questionIndex] === 'undefined') {
        return false;
      }
      const responseValue = value.responses[this.questionIndex].value;
      return responseValue === answerIndex || (
        responseValue instanceof Array && (
          <Array<number>>responseValue
        ).indexOf(answerIndex) > -1
      );
    });
    if (answerIndex > question.answerOptionList.length - 1) {
      // Race condition with the Mathjax / Markdown parsing in the quiz results component
      result.isCorrect = null;
    } else {
      result.isCorrect = question.answerOptionList[answerIndex].isCorrect ? 1 : -1;
    }
    result.absolute = matches.length;
    result.percent = await this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NUMBER_TYPE.PERCENT).toPromise();
  }

  private async updateResultSetForRangedQuestions(result, question): Promise<void> {
    const matches = this.attendeeService.attendees.filter(value => {
      if (typeof value.responses[this.questionIndex] === 'undefined') {
        return false;
      }
      const responseValue = value.responses[this.questionIndex].value;
      if (responseValue instanceof Array) {
        return false;
      }
      if (result.label === 'guessed_correct') {
        return responseValue === question.correctValue;
      } else if (result.label === 'guessed_in_range') {
        return responseValue !== question.correctValue && responseValue >= question.rangeMin && responseValue <= question.rangeMax;
      } else {
        return responseValue < question.rangeMin || responseValue > question.rangeMax;
      }
    });
    result.isCorrect = result.label === 'guessed_correct' ? 1 : result.label === 'guessed_in_range' ? 0 : -1;
    result.label = this.translate.instant(`component.liveResults.${result.label}`);
    result.absolute = matches.length;
    result.percent = await this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NUMBER_TYPE.PERCENT).toPromise();
  }

  private async updateResultSetForFreetextQuestions(result, question): Promise<void> {
    const matches = this.attendeeService.attendees.filter(value => {
      if (typeof value.responses[this.questionIndex] === 'undefined') {
        return false;
      }
      const responseValue = <string>value.responses[this.questionIndex].value;
      if (!responseValue || !responseValue.length) {
        return;
      }
      const answer = <IFreetextAnswerOption>question.answerOptionList[0];
      if (result.label === 'correct_answer') {
        return answer.isCorrectInput(responseValue);
      } else {
        return !answer.isCorrectInput(responseValue);
      }
    });
    result.isCorrect = result.label === 'correct_answer' ? 1 : -1;
    result.label = this.translate.instant(`component.liveResults.${result.label}`);
    result.absolute = matches.length;
    result.percent = await this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NUMBER_TYPE.PERCENT).toPromise();
  }
}
