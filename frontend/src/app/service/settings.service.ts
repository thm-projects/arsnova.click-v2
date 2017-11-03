import {HostListener, Injectable, OnDestroy} from '@angular/core';
import {ConnectionService} from './connection.service';

export declare interface IServerSettings {
  cacheQuizAssets: boolean;
  createQuizPasswordRequired: boolean;
  limitActiveQuizzes: number;
}

@Injectable()
export class SettingsService implements OnDestroy {
  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  private _serverSettings: IServerSettings;

  constructor(
    private connectionService: ConnectionService
  ) {
    this._serverSettings = <IServerSettings>(JSON.parse(window.sessionStorage.getItem('_serverSettings')));
    if (!this._serverSettings) {
      this.initServerSettings();
    }
  }

  private initServerSettings() {
    this.connectionService.initConnection().then((data: any) => {
      this._serverSettings = data.serverConfig;
    });
  }

  @HostListener('window:beforeunload', [ '$event' ])
  ngOnDestroy() {
    window.sessionStorage.setItem('_serverSettings', JSON.stringify(this._serverSettings));
  }
}
