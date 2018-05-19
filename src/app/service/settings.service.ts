import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ConnectionService} from './connection.service';
import {IServerSettings} from 'arsnova-click-v2-types/src/common';
import {isPlatformBrowser} from '@angular/common';

@Injectable()
export class SettingsService {
  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  private _serverSettings: IServerSettings;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this._serverSettings = <IServerSettings>(JSON.parse(window.localStorage.getItem('config.server_settings')));
    }
    if (!this._serverSettings) {
      this.initServerSettings();
    }
  }

  private async initServerSettings() {
    const data = await this.connectionService.initConnection(true);
    this._serverSettings = data.serverConfig;

    // Workaround required because JSON serializes Infinity to null which is then deserialized to NaN by EcmaScript
    if (this._serverSettings.limitActiveQuizzes === null) {
      this._serverSettings.limitActiveQuizzes = Infinity;
    }

    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem('config.server_settings', JSON.stringify(this._serverSettings));
    }
  }
}
