import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../lib/enums/enums';
import { I18nService } from '../../service/i18n/i18n.service';

@Pipe({
  name: 'languageFilter',
  pure: false,
})
export class LanguageFilterPipe implements PipeTransform {

  constructor(private i18nService: I18nService) {}

  public transform<T>(value: Array<T>, options: { selector: string, fallback: Language }): Array<T> {
    if (!value) {
      return [];
    }

    const undefinedLanguageData = value.filter(v => v[options.selector].toLowerCase() === 'und');
    let data = value.filter(v => {
      return v[options.selector].toLowerCase() === this.i18nService.currentLanguage;
    });

    if (!data.length && options.fallback) {
      data = value.filter(v => {
        return v[options.selector].toLowerCase() === options.fallback;
      });
    }

    return data.concat(undefinedLanguageData);
  }
}
