import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'justafew',
  pure: false,
})
export class JustAFewPipe implements PipeTransform {
  public transform(value: Array<any>, start: number): Array<any> {
    return value.slice(Math.max(0, start), start + 100);
  }
}
