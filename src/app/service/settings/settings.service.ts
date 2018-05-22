import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IServerSettings } from 'arsnova-click-v2-types/src/common';
import { ConnectionService } from '../connection/connection.service';

@Injectable()
export class SettingsService {
  private _serverSettings: IServerSettings;

  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this._serverSettings = <IServerSettings>(JSON.parse(window.sessionStorage.getItem('config.server_settings')));
    }
    if (!this._serverSettings) {
      this.initServerSettings();
    }
  }

  private async initServerSettings(): Promise<void> {
    const data = await this.connectionService.initConnection(true);
    this._serverSettings = data.serverConfig;

    // Workaround required because JSON serializes Infinity to null which is then deserialized to NaN by EcmaScript
    if (this._serverSettings.limitActiveQuizzes === null) {
      this._serverSettings.limitActiveQuizzes = Infinity;
    }

    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('config.server_settings', JSON.stringify(this._serverSettings));
    }
  }
}
