import {Injectable} from '@angular/core';

@Injectable()
export class HeaderLabelService {
  set headerLabel(value: string) {
    this._headerLabel = value;
  }
  get headerLabel(): string {
    return this._headerLabel;
  }

  private _headerLabel = 'default';

  constructor() {
  }
}
