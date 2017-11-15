import {Component, Input, OnInit} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../../../../lib/markdown/markdown';
import {I18nService, NumberTypes} from '../../../../service/i18n.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss']
})
export class ReadingConfirmationComponent implements OnInit {
  get percent(): string {
    return this._percent;
  }

  set percent(value: string) {
    this._percent = value;
  }

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  @Input()
  set data(value: any) {
    this._data = value;
    this.percent = this.i18nService.formatNumber(value.percent, NumberTypes.percent);
    this.base = value.base;
    this.absolute = value.absolute;
    this._hasData = true;
  }

  @Input()
  set name(value: string) {
    this._name = parseGithubFlavoredMarkdown(value);
  }

  private _percent: string;
  private _base: number;
  private absolute: number;

  private _data: Object;
  private _hasData = false;

  private _name: string;

  sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  constructor(
    private i18nService: I18nService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
