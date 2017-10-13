import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export interface ILanguage {
  TRANSLATE_REF: string;
}

export class LANGUAGES {
  public readonly AVAILABLE: { DE: ILanguage, EN: ILanguage, FR: ILanguage, IT: ILanguage, ES: ILanguage };

  constructor() {
    this.AVAILABLE = {DE: null, EN: null, FR: null, IT: null, ES: null};
    this.addLanguage('en');
    this.addLanguage('de');
    this.addLanguage('fr');
    this.addLanguage('it');
    this.addLanguage('es');
  }

  private addLanguage(key: string) {
    this.AVAILABLE[key.toUpperCase()] = {TRANSLATE_REF: key};
  }
}

@Injectable()
export class I18nService {

  private _lang = new LANGUAGES();

  constructor(private translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this._lang.AVAILABLE.EN.TRANSLATE_REF);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this._lang.AVAILABLE.EN.TRANSLATE_REF);
  }

  setLanguage(language: string) {
    this.translate.use(this._lang.AVAILABLE[language].TRANSLATE_REF);
  }

}
