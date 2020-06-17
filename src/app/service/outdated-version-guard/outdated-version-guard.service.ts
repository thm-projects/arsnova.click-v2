import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageKey } from '../../lib/enums/enums';
import { OutdatedVersionComponent } from '../../modals/outdated-version/outdated-version.component';

@Injectable({
  providedIn: 'root',
})
export class OutdatedVersionGuardService implements CanActivate {
  private _versionMismatch;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private ngbModal: NgbModal
  ) { }

  public canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    if (!sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep)) {
      // We cannot determine the last version so we set it to the current one
      sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, environment.version);
      return of(true);
    }

    return new Observable<boolean>(subscriber => {
      if (sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep) === 'false') {
        subscriber.next(true);
        subscriber.complete();
        return;
      }

      if (isNotNullOrUndefined(this._versionMismatch)) {
        if (!this._versionMismatch) {
          subscriber.next(true);
          subscriber.complete();
        }

        this.ngbModal.open(OutdatedVersionComponent, {beforeDismiss: () => false}).result.finally(() => {
          subscriber.next(true);
          subscriber.complete();
        });
      }

      this.http.get('/assets/version.txt', { responseType: 'text' }).pipe(
        tap(version => {
          this._versionMismatch = version !== environment.version;

          if (!this._versionMismatch) {
            sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, environment.version);
            subscriber.next(true);
            subscriber.complete();
            return;

          }

          this.ngbModal.open(OutdatedVersionComponent, {beforeDismiss: () => false}).result.finally(() => {
            subscriber.next(true);
            subscriber.complete();
          });
        }),
        catchError(() => {
          subscriber.next(true);
          subscriber.complete();
          return of(true);
        }),
      ).subscribe();
    });
  }
}
