import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
})
export class SearchFilterPipeMock implements PipeTransform {
  public transform(value: Array<any>, args?: any): any {
    return value;
  }
}
