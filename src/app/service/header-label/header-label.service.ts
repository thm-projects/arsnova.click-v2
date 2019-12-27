import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title as BrowserTitle } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { Title } from '../../lib/enums/enums';

@Injectable({
  providedIn: 'root',
})
export class HeaderLabelService {
  public isUnavailableModalOpen: boolean;

  private _headerLabelParams = {};

  get headerLabelParams(): Object {
    return this._headerLabelParams;
  }

  set headerLabelParams(value: Object) {
    this._headerLabelParams = value;
    this.regenerateTitle();
  }

  private _headerLabel = 'default';

  get headerLabel(): string {
    return this._headerLabel;
  }

  set headerLabel(value: string) {
    this._headerLabel = value;
    this.regenerateTitle();
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService, private titleService: BrowserTitle) {
    this.translateService.onLangChange.subscribe(() => {
      this.headerLabel = this._headerLabel;
    });
  }

  private regenerateTitle(): void {
    if (!this._headerLabel || this._headerLabel === 'default') {
      this.titleService.setTitle(HeaderLabelService.getDefaultBrowserTitle());
    } else {
      this.translateService.get(this._headerLabel, this.headerLabelParams).subscribe(translatedValue => {
        this.titleService.setTitle(HeaderLabelService.getDefaultBrowserTitle() + ' - ' + translatedValue);
      });
    }
  }

  private static getDefaultBrowserTitle(): string {
    switch (environment.title) {
      case Title.Default:
        return 'arsnova.click';
      case Title.Westermann:
        return 'Westermann Quiz';
    }
  }
}
