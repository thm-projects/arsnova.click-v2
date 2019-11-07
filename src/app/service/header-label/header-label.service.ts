import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class HeaderLabelService {
  public isUnavailableModalOpen: boolean;

  private _headerLabel = 'default';

  get headerLabel(): string {
    return this._headerLabel;
  }

  set headerLabel(value: string) {
    this._headerLabel = value;
    if (isPlatformBrowser(this.platformId)) {
      if (value === 'default') {
        document.title = 'arsnova.click';
      } else {
        this.translateService.get(value).subscribe(translatedValue => document.title = 'arsnova.click - ' + translatedValue);
      }
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService) {
    this.translateService.onLangChange.subscribe(() => {
      this.headerLabel = this._headerLabel;
    });
  }
}
