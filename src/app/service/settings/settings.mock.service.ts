import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IServerSettings } from 'arsnova-click-v2-types/dist/common';

@Injectable()
export class SettingsMockService {
  private _serverSettings: IServerSettings;

  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  private async initServerSettings(): Promise<void> {
    return new Promise<void>(resolve => resolve());
  }
}
