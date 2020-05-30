import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DbState } from '../../lib/enums/enums';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class InitDbGuard implements CanActivate {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private storageService: StorageService,
    private _userService: UserService, // Required to initialize userService.isLoggedIn which initializes the StorageService
  ) {}

  public canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    return this.storageService.stateNotifier.pipe(filter(val => {
      return [DbState.Initialized, DbState.Revalidate].includes(val);
    }), map(() => true));
  }
}
