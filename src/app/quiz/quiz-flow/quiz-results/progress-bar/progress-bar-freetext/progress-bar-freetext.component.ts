import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-freetext',
  templateUrl: './progress-bar-freetext.component.html',
  styleUrls: ['./progress-bar-freetext.component.scss'],
})
export class ProgressBarFreetextComponent extends AbstractProgressBar {
  public static TYPE = 'ProgressBarFreetextComponent';

  @Input() set attendeeData(value: any) {
    this.initData(value);
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
