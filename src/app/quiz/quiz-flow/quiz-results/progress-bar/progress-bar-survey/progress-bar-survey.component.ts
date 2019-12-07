import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-survey',
  templateUrl: './progress-bar-survey.component.html',
  styleUrls: ['./progress-bar-survey.component.scss'],
})
export class ProgressBarSurveyComponent extends AbstractProgressBar {
  public static TYPE = 'ProgressBarSurveyComponent';

  @Input() set attendeeData(value: any) {
    this.initData(value);
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
