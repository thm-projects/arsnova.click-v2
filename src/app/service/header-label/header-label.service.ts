import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Title } from '@angular/platform-browser';
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
    if (!value || value === 'default') {
      this.titleService.setTitle('arsnova.click');
    } else {
      this.translateService.get(value).subscribe(translatedValue => {
        this.titleService.setTitle('arsnova.click - ' + translatedValue);
      });
    }
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService, private titleService: Title) {
    this.translateService.onLangChange.subscribe(() => {
      this.headerLabel = this._headerLabel;
    });
  }
}
