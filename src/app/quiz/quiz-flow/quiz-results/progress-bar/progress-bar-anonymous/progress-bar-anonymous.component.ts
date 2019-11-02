import { ChangeDetectorRef, Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { QuestionType } from '../../../../../../lib/enums/QuestionType';

@Component({
  selector: 'app-progress-bar-anonymous',
  templateUrl: './progress-bar-anonymous.component.html',
  styleUrls: ['./progress-bar-anonymous.component.scss'],
})
export class ProgressBarAnonymousComponent {
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
    this.cd.markForCheck();
  }

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
  }

  public sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }

  public isSurveyQuestion(): boolean {
    return [QuestionType.SurveyQuestion, QuestionType.ABCDSingleChoiceQuestion].includes(this.type);
  }
}
