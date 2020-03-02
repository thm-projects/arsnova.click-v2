import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { TranslateService } from '@ngx-translate/core';
import { Request } from 'express';
import { CurrencyType, Language, NumberType, StorageKey } from '../../lib/enums/enums';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  private _currentLanguage: Language = Language.EN;

  get currentLanguage(): Language {
    return this._currentLanguage;
  }

  set currentLanguage(value: Language) {
    if (isPlatformBrowser(this.platformId)) {
      this.storageService.db.Config.put({
        value,
        type: StorageKey.Language,
      });
    }

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translateService.use(value.toString());

    this._currentLanguage = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService,
    private storageService: StorageService,
    @Optional() @Inject(REQUEST) protected request?: Request,
  ) {}

  public formatNumber(number: number, type: NumberType = NumberType.Decimal, locale?: string): string {
    if (isNaN(number)) {
      return String(number);
    }

    if (!locale) {
      if (!this.currentLanguage) {
        locale = 'EN';
      } else {
        locale = this.currentLanguage.toString().toUpperCase();
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
      currency: CurrencyType[this.currentLanguage.toString().toUpperCase()],
    });
  }

  public setLanguage(language: Language | string): void {
    if (this.currentLanguage === language) {
      return;
    }

    this.currentLanguage = Language[language.toString().toUpperCase()] ?? Language.EN;
    if (isPlatformServer(this.platformId)) {
      return;
    }
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

  public initLanguage(): void {
    let lang;
    if (isPlatformServer(this.platformId)) {
      lang = this.request.header('accept-language').match(/([A-Z]{2})/);
    } else {
      lang = navigator.language.match(/([A-Z]{2})/);
    }

    if (!Array.isArray(lang) || !lang[0]) {
      this.setLanguage(Language.EN);
    } else {
      this.setLanguage(lang[0]);
    }

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.storageService.db.Config.get(StorageKey.Language).then(storedLanguage => {
      if (storedLanguage && Language[storedLanguage.value.toUpperCase()]) {
        this.setLanguage(Language[storedLanguage.value.toUpperCase()]);
      } else if (Language[this.translateService.getBrowserLang().toUpperCase()]) {
        this.setLanguage(Language[this.translateService.getBrowserLang().toUpperCase()]);
      } else {
        this.setLanguage(Language.EN);
      }
    });

  }

}
