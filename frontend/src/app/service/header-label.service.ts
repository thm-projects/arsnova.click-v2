import {Injectable} from '@angular/core';

@Injectable()
export class HeaderLabelService {
  get headerLabel(): string {
    return this._headerLabel;
  }

  private _headerLabel = 'default';

  constructor() {
  }

  setHeaderLabel(value: string) {
    this._headerLabel = value;
  }
}
