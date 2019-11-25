import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unusedKeyFilter',
})
export class UnusedKeyFilterPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}
