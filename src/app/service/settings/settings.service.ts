import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IServerSettings } from '../../lib/interfaces/IServerSettings';
import { ConnectionService } from '../connection/connection.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private _serverSettings: IServerSettings;

  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private connectionService: ConnectionService, private sharedService: SharedService) {
    if (isPlatformBrowser(this.platformId)) {
      this.initServerSettings();
    }
  }

  private async initServerSettings(): Promise<void> {
    const data = await this.connectionService.initConnection(true);

    if (!data) {
      return;
    }

    this._serverSettings = data.serverConfig;
    this.sharedService.activeQuizzes = data.activeQuizzes;

    // Workaround required because JSON serializes Infinity to null which is then deserialized to NaN by EcmaScript
    if (this._serverSettings.limitActiveQuizzes === null) {
      this._serverSettings.limitActiveQuizzes = Infinity;
    }
  }
}
