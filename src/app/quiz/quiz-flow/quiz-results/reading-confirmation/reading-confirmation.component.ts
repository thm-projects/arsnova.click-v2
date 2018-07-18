import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { parseGithubFlavoredMarkdown } from '../../../../../lib/markdown/markdown';
import { I18nService } from '../../../../service/i18n/i18n.service';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss'],
})
export class ReadingConfirmationComponent {
  public static TYPE = 'ReadingConfirmationComponent';

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
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this._hasData = true;
  }

  private _name: string;

  @Input() set name(value: string) {
    this._name = parseGithubFlavoredMarkdown(value);
  }

  private absolute: number;
  private _hasData = false;

  constructor(private i18nService: I18nService, private sanitizer: DomSanitizer) {
  }

  public sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }
}
