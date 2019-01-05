import { Pipe, PipeTransform } from '@angular/core';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';

@Pipe({
  name: 'unusedKeyFilter',
})
export class UnusedKeyFilterPipe implements PipeTransform {
  constructor(private languageLoaderService: LanguageLoaderService) {}

  public transform(value: Array<any>, args?: any): any {
    if (args) {
      return value.filter(elem => !this.isUnused(elem));
    }

    return value.filter(elem => this.isUnused(elem));
  }

  private isUnused(elem): boolean {
    return !!this.languageLoaderService.unusedKeys.find(unusedKey => unusedKey === elem.key);
  }
}
