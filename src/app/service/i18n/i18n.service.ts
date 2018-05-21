import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export enum Languages {
  DE = <any>'DE',
  EN = <any>'EN',
  FR = <any>'FR',
  IT = <any>'IT',
  ES = <any>'ES'
}

export enum LanguageTranslations {
  DE = <any>'Deutsch',
  EN = <any>'English',
  FR = <any>'Français',
  IT = <any>'Italiano',
  ES = <any>'Español'
}

export enum NumberTypes {
  decimal = <any>'decimal',
  currency = <any>'currency',
  percent = <any>'percent'
}

export enum CurrencyTypes {
  DE = <any>'EUR',
  EN = <any>'EUR',
  FR = <any>'EUR',
  IT = <any>'EUR',
  ES = <any>'EUR'
}

@Injectable()
export class I18nService {
  private _currentLanguage: Languages;

  get currentLanguage(): Languages {
    return this._currentLanguage;
  }

  set currentLanguage(value: Languages) {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('config.language', value.toString());
    }

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(value.toString().toLowerCase());

    this._currentLanguage = value;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
  ) {
    this.initLanguage();
  }

  public formatNumber(number: number, type: NumberTypes = NumberTypes.decimal, locale?: string): string {
    return number.toLocaleString(locale, {
      style: type.toString(),
      currency: CurrencyTypes[this.currentLanguage.toString()],
    });
  }

  public setLanguage(language: Languages): void {
    this.currentLanguage = language;
    this.translate.use(language.toString().toLowerCase());
    if (isPlatformBrowser(this.platformId)) {
      const typ = document.createAttribute('lang');
      typ.value = language.toString().toLowerCase();
      document.getElementsByTagName('html').item(0).attributes.setNamedItem(typ);
    }
  }

  private initLanguage(): void {
    let selectedLanguage: Languages;
    if (isPlatformBrowser(this.platformId) && Languages[window.localStorage.getItem('config.language')]) {
      selectedLanguage = Languages[window.localStorage.getItem('config.language')];
    } else if (isPlatformBrowser(this.platformId) && Languages[this.translate.getBrowserLang().toUpperCase()]) {
      selectedLanguage = Languages[this.translate.getBrowserLang().toUpperCase()];
    } else {
      selectedLanguage = Languages.EN;
    }

    this.setLanguage(selectedLanguage);
  }

}
