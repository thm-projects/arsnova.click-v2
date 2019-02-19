import { isPlatformServer } from '@angular/common';
import { StorageKey } from './enums/enums';

export function jwtOptionsFactory(platformId): any {
  return {
    tokenGetter: () => {
      if (isPlatformServer(platformId)) {
        return null;
      }

      return sessionStorage.getItem(StorageKey.LoginToken);
    },
  };
}
