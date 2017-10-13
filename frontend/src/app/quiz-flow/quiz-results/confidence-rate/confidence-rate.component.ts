import {Component, Input, OnInit} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss']
})
export class ConfidenceRateComponent implements OnInit {
  @Input()
  set data(value: any) {
    this._data = value;
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
  }

  @Input()
  set name(value: string) {
    const result = [value];
    parseGithubFlavoredMarkdown(result);
    this._name = result[0];
  }

  private percent: number;
  private base: number;
  private absolute: number;

  private _data: Object;

  private _name: string;

  constructor() {
  }

  ngOnInit() {
  }

}
