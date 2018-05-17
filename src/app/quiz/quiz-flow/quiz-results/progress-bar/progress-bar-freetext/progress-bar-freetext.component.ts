import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeHtml, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-progress-bar-freetext',
  templateUrl: './progress-bar-freetext.component.html',
  styleUrls: ['./progress-bar-freetext.component.scss']
})
export class ProgressBarFreetextComponent implements OnInit {
  public static TYPE = 'ProgressBarFreetextComponent';

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  get percent(): number {
    return this._percent;
  }

  set percent(value: number) {
    this._percent = value;
  }

  @Input()
  set attendeeData(value: any) {
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this.label = value.label;
    this.progressbarCssClass = typeof value.isCorrect === 'undefined' ? 'default' :
      value.isCorrect === -1 ? 'danger' :
        value.isCorrect === 0 ? 'warning' : 'success';
  }

  private _percent: number;
  private _base: number;
  private absolute: number;
  private label: string;
  private progressbarCssClass: string;

  sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
