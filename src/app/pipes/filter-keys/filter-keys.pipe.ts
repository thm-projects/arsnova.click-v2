import { Pipe, PipeTransform } from '@angular/core';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { FILTER } from '../../shared/enums';

@Pipe({
  name: 'filterKeys',
})
export class FilterKeysPipe implements PipeTransform {

  constructor(private languageLoaderService: LanguageLoaderService) {}

  public transform(value: Array<any>, filterSetting?: FILTER): any {
    switch (filterSetting) {
      case FILTER.NONE:
        return value;
      case FILTER.UNUSED:
        return value.filter(elem => this.isUnused(elem));
      case FILTER.INVALID_KEYS:
        return value.filter(elem => this.hasEmptyKeys(elem));
      case FILTER.INVALID_DE:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, 'DE'));
      case FILTER.INVALID_EN:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, 'en'));
      case FILTER.INVALID_ES:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, 'ES'));
      case FILTER.INVALID_FR:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, 'FR'));
      case FILTER.INVALID_IT:
        return value.filter(elem => this.hasEmptyKeysForLang(elem, 'it'));
    }
  }

  private getKeys(dataNode: object): Array<string> {
    if (!dataNode) {
      return [];
    }
    return Object.keys(dataNode).sort();
  }

  private hasEmptyKeys(elem): boolean {
    return this.getKeys(elem.value).length < this.getKeys(this.languageLoaderService.LANGUAGE).length;
  }

  private hasEmptyKeysForLang(elem, lang): boolean {
    return !elem.value[lang];
  }

  private isUnused(elem): boolean {
    const elements = Object.keys(this.languageLoaderService.unusedKeys).filter(langRef => {
      return this.languageLoaderService.unusedKeys[langRef].find(unusedKey => unusedKey === elem.key);
    });
    return elements.length > 0;
  }

}
