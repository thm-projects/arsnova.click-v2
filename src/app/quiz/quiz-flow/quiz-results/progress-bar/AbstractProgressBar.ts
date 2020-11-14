import { SecurityContext } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

export abstract class AbstractProgressBar {
  private _percent: number;

  protected _base: number;

  public absolute: number;
  public label: string;
  public normalizedAnswerIndex: string;
  public progressbarCssClass: string;

  get percent(): number {
    return this._percent;
  }

  set percent(value: number) {
    this._percent = value;
  }

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  protected constructor(private sanitizer: DomSanitizer) {}

  public sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }

  public sanitizeHTML(value: string): SafeHtml {
    // sanitizer.bypassSecurityTrustHtml is required for highslide and mathjax
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  protected initData(value: any): void {
    if (!value) {
      return;
    }

    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this.label = value.label;
    this.normalizedAnswerIndex = String.fromCharCode(65 + value.answerIndex);
    this.progressbarCssClass = typeof value.isCorrect === 'undefined' ? 'default' : value.isCorrect === -1 ? 'danger' : value.isCorrect === 0
                                                                                                                        ? 'warning' : 'success';
  }
}
