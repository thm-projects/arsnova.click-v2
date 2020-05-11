import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { QuestionType } from '../../../../../lib/enums/QuestionType';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-anonymous',
  templateUrl: './progress-bar-anonymous.component.html',
  styleUrls: ['./progress-bar-anonymous.component.scss'],
})
export class ProgressBarAnonymousComponent extends AbstractProgressBar {
  public static readonly TYPE = 'ProgressBarAnonymousComponent';

  public correct: { absolute: number; percent: string } = {
    absolute: 0,
    percent: '',
  };
  public wrong: { absolute: number; percent: string } = {
    absolute: 0,
    percent: '',
  };
  public neutral: { absolute: number; percent: string } = {
    absolute: 0,
    percent: '',
  };
  public base = 0;

  @Input() public type: QuestionType;

  @Input() set attendeeData(value: any) {
    this.correct = value.correct;
    this.wrong = value.wrong;
    this.base = value.base;
    this.neutral = value.neutral;
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }

  public isSurveyQuestion(): boolean {
    return [QuestionType.SurveyQuestion, QuestionType.ABCDSingleChoiceQuestion].includes(this.type);
  }
}
