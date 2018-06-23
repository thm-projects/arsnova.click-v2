import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { parseGithubFlavoredMarkdown } from '../../../../../lib/markdown/markdown';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { NUMBER_TYPE } from '../../../../shared/enums';

@Component({
  selector: 'app-confidence-rate',
  templateUrl: './confidence-rate.component.html',
  styleUrls: ['./confidence-rate.component.scss'],
})
export class ConfidenceRateComponent {
  public static TYPE = 'ConfidenceRateComponent';

  private _percent: string;

  get percent(): string {
    return this._percent;
  }

  set percent(value: string) {
    this._percent = value;
  }

  private _base: number;

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  private _data: Object;

  @Input() set data(value: any) {
    this._data = value;
    this.i18nService.formatNumber(value.percent, NUMBER_TYPE.PERCENT).toPromise().then(val => this.percent = val);
    this.base = value.base;
    this.absolute = value.absolute;
  }

  private _name: string;

  @Input() set name(value: string) {
    this._name = parseGithubFlavoredMarkdown(value);
  }

  private absolute: number;

  constructor(private i18nService: I18nService, private sanitizer: DomSanitizer) {
  }

  public sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

}
