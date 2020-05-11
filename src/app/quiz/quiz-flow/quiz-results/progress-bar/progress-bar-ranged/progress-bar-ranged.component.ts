import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AbstractProgressBar } from '../AbstractProgressBar';

@Component({
  selector: 'app-progress-bar-ranged',
  templateUrl: './progress-bar-ranged.component.html',
  styleUrls: ['./progress-bar-ranged.component.scss'],
})
export class ProgressBarRangedComponent extends AbstractProgressBar {
  public static readonly TYPE = 'ProgressBarRangedComponent';

  @Input() set attendeeData(value: any) {
    this.initData(value);
  }

  constructor(sanitizer: DomSanitizer) {
    super(sanitizer);
  }
}
