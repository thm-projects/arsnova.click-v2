import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-bar-multiple-choice',
  templateUrl: './progress-bar-multiple-choice.component.html',
  styleUrls: ['./progress-bar-multiple-choice.component.scss']
})
export class ProgressBarMultipleChoiceComponent implements OnInit {
  @Input()
  set attendeeData(value: any) {
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
  }

  private percent: number;
  private base: number;
  private absolute: number;

  constructor() {
  }

  ngOnInit() {
  }

}
