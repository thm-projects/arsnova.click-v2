import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-bar-single-choice',
  templateUrl: './progress-bar-single-choice.component.html',
  styleUrls: ['./progress-bar-single-choice.component.scss']
})
export class ProgressBarSingleChoiceComponent implements OnInit {
  @Input()
  set attendeeData(value: any) {
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this.label = value.label;
    this.normalizedAnswerIndex = String.fromCharCode(65 + value.answerIndex);
  }

  private percent: number;
  private base: number;
  private absolute: number;
  private label: string;
  private normalizedAnswerIndex: string;

  constructor() {
  }

  ngOnInit() {
  }

}
