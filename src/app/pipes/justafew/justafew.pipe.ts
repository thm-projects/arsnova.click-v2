import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'justafew',
})
export class JustAFewPipe implements PipeTransform {
  public transform(value: Array<any>, start: number): Array<any> {
    if (!start || value.length < start) {
      return value;
    }

    return value.slice(0, start);
  }
}
