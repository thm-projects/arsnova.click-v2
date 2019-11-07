import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IServerSettings } from '../../lib/interfaces/IServerSettings';

@Injectable({
  providedIn: 'root',
})
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
