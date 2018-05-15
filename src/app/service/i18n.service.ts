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

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use(value.toString().toLowerCase());

    this._currentLanguage = value;
  }

  private _currentLanguage: Languages;

  constructor(private translate: TranslateService) {}

  public formatNumber(number: number, type: NumberTypes = NumberTypes.decimal): string {
    return number.toLocaleString(undefined, {
      style: type.toString(),
      currency: CurrencyTypes[this.currentLanguage.toString()]
    });
  }

  initLanguage() {
    let selectedLanguage: Languages;
    if (Languages[window.localStorage.getItem('config.language')]) {
      selectedLanguage = Languages[window.localStorage.getItem('config.language')];
    } else if (Languages[this.translate.getBrowserLang().toUpperCase()]) {
      selectedLanguage = Languages[this.translate.getBrowserLang().toUpperCase()];
    } else {
      selectedLanguage = Languages.EN;
    }

    this.setLanguage(selectedLanguage);
  }

  setLanguage(language: Languages) {
    this.currentLanguage = language;
    this.translate.use(language.toString().toLowerCase());
    const typ = document.createAttribute('lang');
    typ.value = language.toString().toLowerCase();
    document.getElementsByTagName('html').item(0).attributes.setNamedItem(typ);
  }

}
