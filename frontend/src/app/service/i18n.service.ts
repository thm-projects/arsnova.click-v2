import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export enum Languages {
  DE = <any>'DE',
  EN = <any>'EN',
  FR = <any>'FR',
  IT = <any>'IT',
  ES = <any>'ES'
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

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(Languages.EN.toString().toLowerCase());

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(Languages.EN.toString().toLowerCase());

    this._currentLanguage = Languages.EN;
  }

  public formatNumber(number: number, type: NumberTypes = NumberTypes.decimal): string {
    return number.toLocaleString(undefined, {
      style: type.toString(),
      currency: CurrencyTypes[this._currentLanguage.toString()]
    });
  }

  setLanguage(language: Languages) {
    this._currentLanguage = Languages.EN;
    this.translate.use(language.toString().toLowerCase());
  }

}
