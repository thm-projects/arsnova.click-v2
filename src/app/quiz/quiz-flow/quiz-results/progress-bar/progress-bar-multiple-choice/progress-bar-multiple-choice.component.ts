import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-multiple-choice',
  templateUrl: './progress-bar-multiple-choice.component.html',
  styleUrls: ['./progress-bar-multiple-choice.component.scss'],
})
export class ProgressBarMultipleChoiceComponent extends AbstractProgressBar {
  public static TYPE = 'ProgressBarMultipleChoiceComponent';

  @Input() set attendeeData(value: any) {
    this.initData(value);
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
