import {Injectable} from '@angular/core';
import {ConnectionService} from './connection.service';

export declare interface IServerSettings {
  cacheQuizAssets: boolean;
  createQuizPasswordRequired: boolean;
  limitActiveQuizzes: number;
}

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

  private initServerSettings() {
    this.connectionService.initConnection(true).then((data: any) => {
      this._serverSettings = data.serverConfig;

      // Workaround required because JSON serializes Infinity to null which is then deserialized to NaN by EcmaScript
      if (this._serverSettings.limitActiveQuizzes === null) {
        this._serverSettings.limitActiveQuizzes = Infinity;
      }

      window.localStorage.setItem('config.server_settings', JSON.stringify(this._serverSettings));
    });
  }
}
