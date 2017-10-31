import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

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
  get currentLanguage(): Languages {
    return this._currentLanguage;
  }
  set currentLanguage(value: Languages) {
    window.localStorage.setItem('config.language', value.toString());
    this._currentLanguage = value;
  }

  private _currentLanguage: Languages;

  constructor(private translate: TranslateService) {
    let selectedLanguage: Languages;
    if (Languages[window.localStorage.getItem('config.language')]) {
      selectedLanguage = Languages[window.localStorage.getItem('config.language')];
    } else if (Languages[navigator.language]) {
      selectedLanguage = Languages[navigator.language];
    } else {
      selectedLanguage = Languages.EN;
    }

    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(selectedLanguage.toString().toLowerCase());

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(selectedLanguage.toString().toLowerCase());

    this.currentLanguage = selectedLanguage;
  }

  public formatNumber(number: number, type: NumberTypes = NumberTypes.decimal): string {
    return number.toLocaleString(undefined, {
      style: type.toString(),
      currency: CurrencyTypes[this.currentLanguage.toString()]
    });
  }

  setLanguage(language: Languages) {
    this.currentLanguage = language;
    this.translate.use(language.toString().toLowerCase());
  }

}
