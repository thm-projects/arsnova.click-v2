import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { IServerSettings } from 'arsnova-click-v2-types/src/common';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { ConnectionService } from '../connection/connection.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SettingsService {
  private _serverSettings: IServerSettings;

  get serverSettings(): IServerSettings {
    return this._serverSettings;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private connectionService: ConnectionService, private storageService: StorageService) {
    if (isPlatformBrowser(this.platformId)) {
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
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.SERVER_SETTINGS, this._serverSettings).subscribe();
    }
  }
}
