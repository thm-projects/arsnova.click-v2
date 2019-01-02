import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FreeTextAnswerEntity } from '../../../../../lib/entities/answer/FreetextAnwerEntity';
import { AbstractQuestionEntity } from '../../../../../lib/entities/question/AbstractQuestionEntity';
import { NumberType } from '../../../../../lib/enums/enums';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { QuizService } from '../../../../service/quiz/quiz.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent {
  public static TYPE = 'ProgressBarComponent';

  @Input() public data: Array<string>;
  @Input() public questionIndex: number;
  @Input() public question: AbstractQuestionEntity;
  @Input() public hideProgressbarCssStyle: boolean;

  constructor(
    private attendeeService: AttendeeService,
    private translate: TranslateService,
    private quizService: QuizService,
    private i18nService: I18nService,
  ) {
  }

  public attendeeDataForAnswer(answerIndex: number): object {
    if (!this.attendeeService.attendees.length || !this.quizService.quiz) {
      console.error('No attendees or no quiz found in the progress-bar component. Aborting.');
      return {};
    }

    const question = this.quizService.quiz.questionList[this.questionIndex];
    const result = {
      answerIndex: answerIndex,
      label: this.data[answerIndex],
      absolute: 0,
      base: this.attendeeService.attendees.length,
      percent: '0',
      isCorrect: 0,
    };

    if (question.TYPE === QuestionType.RangedQuestion) {
      this.updateResultSetForRangedQuestions(result, question);
    } else if (question.TYPE === QuestionType.FreeTextQuestion) {
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
    if (question.answerOptionList.length <= answerIndex) {
      return;
    }

    const matches = this.attendeeService.attendees.filter(value => {
      if (typeof value.responses[this.questionIndex] === 'undefined') {
        return false;
      }
      const responseValue: any = value.responses[this.questionIndex].value;

      if (responseValue instanceof Array) {
        if (isNaN(responseValue[0])) {
          return (<any>responseValue.indexOf(question.answerOptionList[answerIndex].answerText)) > -1;
        } else {
          return (<any>responseValue.indexOf(answerIndex)) > -1;
        }
      } else {
        return responseValue === answerIndex;
      }
    });
    if (answerIndex > question.answerOptionList.length - 1) {
      // Race condition with the Mathjax / Markdown parsing in the quiz results component
      result.isCorrect = null;
    } else {
      result.isCorrect = question.answerOptionList[answerIndex].isCorrect ? 1 : -1;
    }
    result.absolute = matches.length;
    result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberType.Percent);
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
    result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberType.Percent);
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
      const answer = question.answerOptionList[0] = new FreeTextAnswerEntity(question.answerOptionList[0]);
      if (result.label === 'correct_answer') {
        return answer.isCorrectInput(responseValue);
      } else {
        return !answer.isCorrectInput(responseValue);
      }
    });
    result.isCorrect = result.label === 'correct_answer' ? 1 : -1;
    result.label = this.translate.instant(`component.liveResults.${result.label}`);
    result.absolute = matches.length;
    result.percent = this.i18nService.formatNumber(matches.length / this.attendeeService.attendees.length, NumberType.Percent);
  }
}
