import { Pipe, PipeTransform } from '@angular/core';

interface ISearchType {
  key: string;
  value?: object;
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
        return val.toLowerCase().includes(searchFilter.trim().toLowerCase());
      }

      return (val as ISearchType).key.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
             Object.values((val as ISearchType).value || {}).some(keyValues => keyValues.toLowerCase().includes(searchFilter.trim().toLowerCase()));
    });
  }

}
