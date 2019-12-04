import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'justafew',
})
export class JustAFewPipe implements PipeTransform {
  public transform<T>(value: Array<T>, start: number): Array<T> {
    if (!start || value.length < start) {
      return value;
    }

    return value.slice(0, start);
  }
}
