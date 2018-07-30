import { DB_TABLE, STORAGE_KEY } from '../app/shared/enums';

export function jwtOptionsFactory(storageService): any {
  return {
    tokenGetter: async () => {
      const tokens = await storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.TOKEN).toPromise();

      return tokens ? tokens.staticLoginToken : null;
    },
  };
}
