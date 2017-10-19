import {Component, Input, OnInit} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-progress-bar-freetext',
  templateUrl: './progress-bar-freetext.component.html',
  styleUrls: ['./progress-bar-freetext.component.scss']
})
export class ProgressBarFreetextComponent implements OnInit {
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
  }

  private _percent: number;
  private _base: number;
  private absolute: number;

  sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
