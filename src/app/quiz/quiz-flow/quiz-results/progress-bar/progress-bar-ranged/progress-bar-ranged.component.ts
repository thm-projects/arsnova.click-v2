import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-progress-bar-ranged',
  templateUrl: './progress-bar-ranged.component.html',
  styleUrls: ['./progress-bar-ranged.component.scss'],
})
export class ProgressBarRangedComponent {
  public static TYPE = 'ProgressBarRangedComponent';

  @Input() set attendeeData(value: any) {
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this.label = value.label;
    this.progressbarCssClass = typeof value.isCorrect === 'undefined' ? 'default' : value.isCorrect === -1 ? 'danger' : value.isCorrect === 0
                                                                                                                        ? 'warning' : 'success';
    this.cd.markForCheck();
  }

  private _percent: number;

  get percent(): number {
    return this._percent;
  }

  set percent(value: number) {
    this._percent = value;
  }

  private _base: number;

  get base(): number {
    return this._base;
  }

  set base(value: number) {
    this._base = value;
  }

  private absolute: number;
  private label: string;
  private progressbarCssClass: string;

  constructor(private sanitizer: DomSanitizer, private cd: ChangeDetectorRef) {
  }

  public sanitizeStyle(value: string | number): SafeStyle {
    value = value.toString().replace(/\s/g, '');
    return this.sanitizer.bypassSecurityTrustStyle(`${value}`);
  }

  public sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(`${value}`);
  }
}
