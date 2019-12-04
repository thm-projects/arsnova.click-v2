import { Pipe, PipeTransform } from '@angular/core';
import { Filter, Language } from '../../lib/enums/enums';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';

@Pipe({
  name: 'filterKeys',
})
export class FilterKeysPipe implements PipeTransform {

  constructor(private languageLoaderService: LanguageLoaderService) {}

  public transform<T>(value: Array<T>, filterSetting?: Filter): Array<T> {
    switch (filterSetting) {
      case Filter.None:
        return value;
      case Filter.InvalidKeys:
        return value.filter(elem => this.hasEmptyKeys(elem));
      case Filter.InvalidDE:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, Language.DE));
      case Filter.InvalidEN:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, Language.EN));
      case Filter.InvalidES:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, Language.ES));
      case Filter.InvalidFr:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, Language.FR));
      case Filter.InvalidIt:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, Language.IT));
    }
  }

  private getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode);
  }

  private hasEmptyKeys(elem): boolean {
    return this.getKeys(elem.value).length < this.getKeys(this.languageLoaderService.language).length;
  }

  private hasEmptyKeysForLang(elem, lang): boolean {
    return !elem.value[lang];
  }
}
