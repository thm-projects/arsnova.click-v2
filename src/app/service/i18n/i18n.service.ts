import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CURRENCY_TYPE, DB_TABLE, LANGUAGE, NUMBER_TYPE, STORAGE_KEY } from '../../shared/enums';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class I18nService {
  private _currentLanguage: LANGUAGE = LANGUAGE.EN;

  get currentLanguage(): LANGUAGE {
    return this._currentLanguage;
  }

  set currentLanguage(value: LANGUAGE) {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.LANGUAGE, value).subscribe();
    }

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translateService.use(value.toString().toLowerCase());

    this._currentLanguage = value;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService, private storageService: StorageService) {
    this.initLanguage();
  }

  public formatNumber(number: number, type: NUMBER_TYPE = NUMBER_TYPE.DECIMAL, locale?: string): string {
    if (isNaN(number)) {
      throw new Error(`Unsupported number: ${number}. Type was ${type.toString()}`);
    }

    if (!locale) {
      if (!this.currentLanguage) {
        locale = 'EN';
      } else {
        locale = this.currentLanguage.toString();
      }
    }

    if (!this.currentLanguage) {
      return parseFloat(String(number)).toLocaleString(locale, {
        style: type.toString(),
        currency: 'EUR',
      });
    }

    return parseFloat(String(number)).toLocaleString(locale, {
      style: type.toString(),
      currency: CURRENCY_TYPE[this.currentLanguage.toString()],
    });
  }

  public setLanguage(language: LANGUAGE | string): void {
    this.currentLanguage = LANGUAGE[language.toString().toUpperCase()];
    if (isPlatformBrowser(this.platformId)) {
      const typ = document.createAttribute('lang');
      typ.value = language.toString().toLowerCase();
      document.getElementsByTagName('html').item(0).attributes.setNamedItem(typ);

      const consoleLogStyle = [
        'background: linear-gradient(#D33106, #571402)',
        'border: 1px solid #3E0E02',
        'color: white',
        'display: block',
        'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
        'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
        'line-height: 20px',
        'text-align: center',
        'padding: 20px',
        'font-weight: bold',
      ].join(';');
      this.translateService.get('global.console-log-warning').subscribe(value => {
        console.log(`%c${value}`, consoleLogStyle);
      });
    }
  }

  private async initLanguage(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      this.setLanguage(LANGUAGE.EN);
      return;
    }


    const storedLanguage = await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.LANGUAGE).toPromise();
    if (LANGUAGE[storedLanguage]) {
      this.setLanguage(LANGUAGE[storedLanguage]);
    } else if (LANGUAGE[this.translateService.getBrowserLang().toUpperCase()]) {
      this.setLanguage(LANGUAGE[this.translateService.getBrowserLang().toUpperCase()]);
    } else {
      this.setLanguage(LANGUAGE.EN);
    }

  }

}
