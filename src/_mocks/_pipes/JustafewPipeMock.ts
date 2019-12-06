import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'justafew',
})
export class JustafewPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}
