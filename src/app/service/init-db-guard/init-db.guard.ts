import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DbState } from '../../lib/enums/enums';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class InitDbGuard implements CanActivate {

  constructor(private storageService: StorageService) {}

  public canActivate(): Observable<boolean> {
    return this.storageService.stateNotifier.pipe(filter(val => val === DbState.Initialized), map(() => true));
  }
}
