import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}
