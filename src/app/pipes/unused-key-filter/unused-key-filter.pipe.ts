import { Pipe, PipeTransform } from '@angular/core';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';

@Pipe({
  name: 'unusedKeyFilter',
  pure: false,
})
export class UnusedKeyFilterPipe implements PipeTransform {
  constructor(private languageLoaderService: LanguageLoaderService) {}

  public transform<T>(value: Array<T>, filterUnused?: boolean): Array<T> {
    if (filterUnused) {
      return value.filter(elem => this.isUnused(elem));
    }

    return value.filter(elem => !this.isUnused(elem));
  }

  private isUnused(elem): boolean {
    return this.languageLoaderService.unusedKeys.some(unusedKey => unusedKey === elem.key);
  }
}
