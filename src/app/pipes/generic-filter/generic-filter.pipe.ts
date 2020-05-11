import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'genericFilter',
})
export class GenericFilterPipe implements PipeTransform {

  public constructor(private translateService: TranslateService) {}

  public transform<T extends any>(value: Array<T>, args?: string | { [key: string]: any }): Array<T> {
    if (!args || !Object.keys(args).length) {
      return value;
    }

    if (typeof args === 'string') {
      return value.filter(val => val.includes(args));
    }

    const translateKeys = args.$translateKeys;
    const parsedArgs = Object.entries(args).filter(arg => !['$translateKeys'].includes(arg[0]));

    return value.filter(val => parsedArgs.every(arg => {
      const regex = new RegExp(arg[1], 'gi');
      const parsedObjectValue = arg[0].split('.').reduce((o, i) => o[i], val);

      if (translateKeys) {
        return this.translateService.instant(parsedObjectValue).match(regex);
      }

      return parsedObjectValue.match(regex);
    }));
  }

}
