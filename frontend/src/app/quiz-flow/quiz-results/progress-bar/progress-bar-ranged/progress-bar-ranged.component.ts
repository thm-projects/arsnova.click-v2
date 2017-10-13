import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-progress-bar-ranged',
  templateUrl: './progress-bar-ranged.component.html',
  styleUrls: ['./progress-bar-ranged.component.scss']
})
export class ProgressBarRangedComponent implements OnInit {
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
