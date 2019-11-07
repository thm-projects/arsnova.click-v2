import { ChangeDetectorRef, Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-progress-bar-survey',
  templateUrl: './progress-bar-survey.component.html',
  styleUrls: ['./progress-bar-survey.component.scss'],
})
export class ProgressBarSurveyComponent {
  public static TYPE = 'ProgressBarSurveyComponent';
  public absolute: number;
  public label: string;
  public normalizedAnswerIndex: string;

  @Input() set attendeeData(value: any) {
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this.label = value.label;
    this.normalizedAnswerIndex = String.fromCharCode(65 + value.answerIndex);
    this.cd.markForCheck();
  }

  private _percent: number;

  get percent(): number {
    return this._percent;
  }

  set percent(value: number) {
    this._percent = value;
  }

  private _base: number;

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
  }

  public sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }

  public sanitizeHTML(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, `${value}`);
  }
}
