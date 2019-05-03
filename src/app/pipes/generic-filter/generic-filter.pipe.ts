import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'genericFilter',
})
export class GenericFilterPipe implements PipeTransform {

  public constructor(private translateService: TranslateService) {}

  public transform<T extends any>(value: Array<T>, args?: string | { [key: string]: any }): Array<T> {
    if (!args || (typeof args === 'string' && !args.length) || !Object.keys(args).length) {
      return value;
    }

    if (typeof args === 'string') {
      return value.filter(val => val.includes(args));
    }

    const translateKeys = args.$translateKeys;
    const parsedArgs = Object.entries(args).filter(arg => !['$translateKeys'].includes(arg[0]));

    return value.filter(val => parsedArgs.every(arg => {
      const regex = new RegExp(arg[1], 'gi');

      if (translateKeys) {
        return this.translateService.instant(val[arg[0]]).match(regex);
      }

      return val[arg[0]].includes(regex);
    }));
  }

}
