import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export enum Languages {
  DE = <any>'DE', EN = <any>'EN', FR = <any>'FR', IT = <any>'IT', ES = <any>'ES'
}

export enum LanguageTranslations {
  DE = <any>'Deutsch', EN = <any>'English', FR = <any>'Français', IT = <any>'Italiano', ES = <any>'Español'
}

export enum NumberTypes {
  decimal = <any>'decimal', currency = <any>'currency', percent = <any>'percent'
}

export enum CurrencyTypes {
  DE = <any>'EUR', EN = <any>'EUR', FR = <any>'EUR', IT = <any>'EUR', ES = <any>'EUR'
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
    this.translateService.use(value.toString().toLowerCase());

    this._currentLanguage = value;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private translateService: TranslateService) {
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
    this.translateService.use(language.toString().toLowerCase());
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

  private initLanguage(): void {
    let selectedLanguage: Languages;
    if (isPlatformBrowser(this.platformId) && Languages[window.localStorage.getItem('config.language')]) {
      selectedLanguage = Languages[window.localStorage.getItem('config.language')];
    } else if (isPlatformBrowser(this.platformId) && Languages[this.translateService.getBrowserLang().toUpperCase()]) {
      selectedLanguage = Languages[this.translateService.getBrowserLang().toUpperCase()];
    } else {
      selectedLanguage = Languages.EN;
    }

    this.setLanguage(selectedLanguage);
  }

}
