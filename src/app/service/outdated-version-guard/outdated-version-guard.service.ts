import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageKey } from '../../lib/enums/enums';
import { OutdatedVersionComponent } from '../../modals/outdated-version/outdated-version.component';

@Injectable({
  providedIn: 'root',
})
export class OutdatedVersionGuardService implements CanActivate {
  private _versionMismatch: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private ngbModal: NgbModal
  ) { }

  public canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    return new Observable<boolean>(subscriber => {

      if (this._versionMismatch) {
        this.ngbModal.open(OutdatedVersionComponent, {beforeDismiss: () => false}).result.finally(() => {
          subscriber.next(true);
          subscriber.complete();
        });
        return;
      }

      this.http.get('/assets/version.txt', { responseType: 'text' }).pipe(
        tap(version => {
          this._versionMismatch = version.trim() !== environment.version;

          if (!this._versionMismatch || !sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep)) {
            sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, version.trim());
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
