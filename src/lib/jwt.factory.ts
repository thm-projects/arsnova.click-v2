import { isPlatformServer } from '@angular/common';

export function jwtOptionsFactory(platformId): any {
  return {
    tokenGetter: () => {
      if (isPlatformServer(platformId)) {
        return null;
      }

      return sessionStorage.getItem('token');
    },
  };
}
