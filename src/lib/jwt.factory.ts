import { StorageService } from '../app/service/storage/storage.service';
import { DB_TABLE, STORAGE_KEY } from '../app/shared/enums';

export function jwtOptionsFactory(storageService: StorageService): any {
  return {
    tokenGetter: async () => {
      const tokens = await storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.TOKEN).toPromise();

      return tokens ? tokens.staticLoginToken : null;
    },
  };
}
