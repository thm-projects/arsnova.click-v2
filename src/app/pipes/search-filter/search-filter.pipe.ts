import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter',
  pure: false,
})
export class SearchFilterPipe implements PipeTransform {

  public transform(value: Array<any>, args?: string): Array<any> {
    if (!args || !args.length) {
      return value;
    }
    return value.filter(val => val.key.indexOf(args) > -1);
  }

}
