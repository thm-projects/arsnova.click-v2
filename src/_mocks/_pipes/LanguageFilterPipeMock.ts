import { Pipe, PipeTransform } from '@angular/core';
import { Language } from '../../app/lib/enums/enums';

@Pipe({
  name: 'languageFilter',
})
export class LanguageFilterPipeMock implements PipeTransform {

  public transform<T>(value: Array<T>, options: { selector: string, fallback: Language }): Array<T> {
    return value;
  }
}
