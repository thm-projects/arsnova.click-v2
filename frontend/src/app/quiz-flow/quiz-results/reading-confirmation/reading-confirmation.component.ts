import {Component, Input, OnInit} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss']
})
export class ReadingConfirmationComponent implements OnInit {
  get hasData(): boolean {
    return this._hasData;
  }
  @Input()
  set data(value: any) {
    this._data = value;
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this._hasData = true;
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
  private _hasData = false;

  private _name: string;

  constructor() { }

  ngOnInit() {
  }

}
