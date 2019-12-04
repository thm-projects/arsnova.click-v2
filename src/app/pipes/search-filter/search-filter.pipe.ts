import { Pipe, PipeTransform } from '@angular/core';

interface ISearchType {
  key: string;
}

@Pipe({
  name: 'searchFilter',
  pure: false,
})
export class SearchFilterPipe implements PipeTransform {

  public transform<T extends ISearchType | string>(value: Array<T>, searchFilter?: string): Array<T> {
    if (!searchFilter) {
      return value;
    }

    return value.filter(val => {
      if (typeof val === 'string') {
        return val.includes(searchFilter);
      }

      return (
        val as ISearchType
      ).key.includes(searchFilter);
    });
  }

}
