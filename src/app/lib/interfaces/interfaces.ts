import { Type } from '@angular/core';

export interface INamedType extends Type<Function> {
  TYPE: string;
}
