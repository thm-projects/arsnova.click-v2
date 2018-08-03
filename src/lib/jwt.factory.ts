import { isPlatformServer } from '@angular/common';
import { StorageService } from '../app/service/storage/storage.service';
import { DB_TABLE, STORAGE_KEY } from '../app/shared/enums';

export function jwtOptionsFactory(platformId, storageService: StorageService): any {
  return {
    tokenGetter: async () => {
      if (isPlatformServer(platformId)) {
        return null;
      }

      const tokens = await storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.TOKEN).toPromise();

      return tokens ? tokens.staticLoginToken : null;
    },
  };
}
