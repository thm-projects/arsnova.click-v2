import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {

  public transform(value: Array<any>, args?: string): Array<any> {
    return value.sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0);
  }

}
