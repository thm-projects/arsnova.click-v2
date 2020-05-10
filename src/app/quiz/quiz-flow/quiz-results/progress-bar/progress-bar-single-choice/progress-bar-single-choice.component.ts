import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-single-choice',
  templateUrl: './progress-bar-single-choice.component.html',
  styleUrls: ['./progress-bar-single-choice.component.scss'],
})
export class ProgressBarSingleChoiceComponent extends AbstractProgressBar {
  public static readonly TYPE = 'ProgressBarSingleChoiceComponent';

  @Input() set attendeeData(value: any) {
    this.initData(value);
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
