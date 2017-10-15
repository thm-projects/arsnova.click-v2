import {Component, Input, OnInit} from '@angular/core';
import {parseGithubFlavoredMarkdown} from '../../../../lib/markdown/markdown';
import {I18nService, NumberTypes} from '../../../service/i18n.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

@Component({
  selector: 'app-reading-confirmation',
  templateUrl: './reading-confirmation.component.html',
  styleUrls: ['./reading-confirmation.component.scss']
})
export class ReadingConfirmationComponent implements OnInit {
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
    const result = [value];
    parseGithubFlavoredMarkdown(result);
    this._name = result[0];
  }

  private percent: string;
  private base: number;
  private absolute: number;

  private _data: Object;
  private _hasData = false;

  private _name: string;

  sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  constructor(private i18nService: I18nService,
    private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
  }

}
