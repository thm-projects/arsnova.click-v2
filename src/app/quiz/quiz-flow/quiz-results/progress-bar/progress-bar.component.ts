import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {IQuestion} from '../../../../../lib/questions/interfaces';
import {AttendeeService} from '../../../../service/attendee.service';
import {I18nService, NumberTypes} from '../../../../service/i18n.service';
import {RangedQuestion} from '../../../../../lib/questions/question_ranged';
import {FreeTextQuestion} from '../../../../../lib/questions/question_freetext';
import {CurrentQuizService} from '../../../../service/current-quiz.service';
import {TranslateService} from '@ngx-translate/core';
import {IFreetextAnswerOption} from '../../../../../lib/answeroptions/interfaces';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnDestroy {

  @Input() data: Array<string>;
  @Input() questionIndex: number;
  @Input() question: IQuestion;
  @Input() hideProgressbarCssStyle: boolean;

  constructor(
    private attendeeService: AttendeeService,
    private translate: TranslateService,
    private currentQuizService: CurrentQuizService,
    private i18nService: I18nService) {
  }

  attendeeDataForAnswer(answerIndex: number): Object {
    const question = this.currentQuizService.quiz.questionList[this.questionIndex];
    const result = {
      answerIndex: answerIndex,
      label: this.data[answerIndex],
      absolute: 0,
      base: this.attendeeService.attendees.length,
      percent: '0',
      isCorrect: 0
    };
    if (question instanceof RangedQuestion) {
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
      result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberTypes.percent);

    } else if (question instanceof FreeTextQuestion) {
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
      result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberTypes.percent);

    } else {
      const matches = this.attendeeService.attendees.filter(value => {
        if (typeof value.responses[this.questionIndex] === 'undefined') {
          return false;
        }
        const responseValue = value.responses[this.questionIndex].value;
        return responseValue === answerIndex ||
               (responseValue instanceof Array && (<Array<number>>responseValue).indexOf(answerIndex) > -1);
      });
      if (answerIndex > question.answerOptionList.length - 1) {
        // Race condition with the Mathjax / Markdown parsing in the quiz results component
        result.isCorrect = null;
      } else {
        result.isCorrect = question.answerOptionList[answerIndex].isCorrect ? 1 : -1;
      }
      result.absolute = matches.length;
      result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberTypes.percent);
    }
    if (this.hideProgressbarCssStyle) {
      delete result.isCorrect;
    }
    return result;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
