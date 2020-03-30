import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class InitDbGuard implements CanActivate {

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private storageService: StorageService) {}

  public canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }
    return of(true);

    /*
     FIXME This does not work with ssr - the browser app is not bootstrapped then
     return this.storageService.stateNotifier.pipe(filter(val => {
     console.log('state notifier fired, will succeed:', val === DbState.Initialized);
     return val === DbState.Initialized;
     }), map(() => true));
     */
  }
}
