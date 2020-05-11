import { ChangeDetectorRef, Component, Input, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { I18nService } from '../../../../service/i18n/i18n.service';

@Component({
  selector: 'app-reading-confirmation-progress',
  templateUrl: './reading-confirmation-progress.component.html',
  styleUrls: ['./reading-confirmation-progress.component.scss'],
})
export class ReadingConfirmationProgressComponent {
  public static readonly TYPE = 'ReadingConfirmationProgressComponent';

  private _percent: string;
  private _base: number;
  private _data: Object;
  private _name: string;
  private _hasData = false;

  public absolute: number;

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

  @Input() set data(value: any) {
    this._data = value;
    this.percent = value.percent;
    this.base = value.base;
    this.absolute = value.absolute;
    this._hasData = true;
    this.cd.markForCheck();
  }

  @Input() set name(value: string) {
    this._name = this.customMarkdownService.parseGithubFlavoredMarkdown(value);
  }

  constructor(
    private i18nService: I18nService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private customMarkdownService: CustomMarkdownService,
  ) {
  }

  public sanitizeStyle(value: string): SafeStyle {
    value = value.replace(/\s/g, '');
    return this.sanitizer.sanitize(SecurityContext.STYLE, `${value}`);
  }
}
