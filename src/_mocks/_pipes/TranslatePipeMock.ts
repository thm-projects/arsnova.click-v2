import { Pipe, PipeTransform } from '@angular/core';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Pipe({
  name: 'translate',
})
export class TranslatePipeMock implements PipeTransform {
  public transform(value: any, ...args): any {
    return value;
  }
}
