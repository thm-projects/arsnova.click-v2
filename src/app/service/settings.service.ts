import {Injectable} from '@angular/core';
import {ConnectionService} from './connection.service';
import {IServerSettings} from 'arsnova-click-v2-types/src/common';

@Injectable()
export class SettingsService {
  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  private _serverSettings: IServerSettings;

  constructor(
    private connectionService: ConnectionService
  ) {
    this._serverSettings = <IServerSettings>(JSON.parse(window.localStorage.getItem('config.server_settings')));
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

    window.localStorage.setItem('config.server_settings', JSON.stringify(this._serverSettings));
  }
}
