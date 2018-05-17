import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class HeaderLabelService {
  set headerLabel(value: string) {
    this._headerLabel = value;
    if (value === 'default') {
      document.title = 'arsnova.click';
    } else {
      this.translateService.get(value).subscribe(translatedValue => document.title = 'arsnova.click - ' + translatedValue);
    }
  }
  get headerLabel(): string {
    return this._headerLabel;
  }

  private _headerLabel = 'default';

  constructor(private translateService: TranslateService) {
  }
}
