import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title as BrowserTitle } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Title } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class HeaderLabelService {
  private _headerLabelParams = {};
  private _headerLabel = 'default';
  private _subHeader: string;

  public isUnavailableModalOpen: boolean;

  get headerLabelParams(): Object {
    return this._headerLabelParams;
  }

  set headerLabelParams(value: Object) {
    this._headerLabelParams = value;
    this.regenerateTitle();
  }

  get headerLabel(): string {
    return this._headerLabel;
  }

  set headerLabel(value: string) {
    this._headerLabel = value;
    this.regenerateTitle();
  }

  get subHeader(): string {
    return this._subHeader;
  }

  set subHeader(value: string) {
    this._subHeader = value;
    this.regenerateTitle();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService, private titleService: BrowserTitle) {
    this.translateService.onLangChange.subscribe(() => {
      this.headerLabel = this._headerLabel;
    });
  }

  public hasHeaderLabelParams(): boolean {
    return Object.keys(this.headerLabelParams || {}).length > 0;
  }

  public reset(): void {
    this.headerLabel = 'default';
    this.headerLabelParams = {};
    this.subHeader = null;
  }

  private regenerateTitle(): void {
    if (!this._headerLabel || this._headerLabel === 'default') {
      this.titleService.setTitle(HeaderLabelService.getDefaultBrowserTitle());
    } else {
      this.translateService
        .get(this._headerLabel, this.headerLabelParams)
        .subscribe(translatedValue => {
          if (this.hasHeaderLabelParams()) {
            this.titleService.setTitle(HeaderLabelService.getDefaultBrowserTitle() + ' - ' + translatedValue);
          } else {
            this.titleService.setTitle(HeaderLabelService.getDefaultBrowserTitle());
          }
        });
    }
  }

  private static getDefaultBrowserTitle(): string {
    switch (environment.title) {
      case Title.Default:
        return '✦click';
      case Title.Westermann:
        return 'Westermann Quiz';
    }
  }
}
