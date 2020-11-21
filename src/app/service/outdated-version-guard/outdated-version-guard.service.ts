import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
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
  private _targetVersion: string;
  private _currentVersion: string;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private ngbModal: NgbModal,
  ) { }

  public canActivate(): Observable<boolean> {
    if (isPlatformServer(this.platformId)) {
      return of(true);
    }

    const storedVersion = sessionStorage.getItem(StorageKey.OutdatedVersionFunnelStep)?.trim() ?? null;
    this._currentVersion = storedVersion !== null && isNaN(parseInt(storedVersion, 10)) ? storedVersion : environment.version;

    return new Observable<boolean>(subscriber => {

      if (this._versionMismatch) {
        this.openModal().result.finally(() => {
          subscriber.next(true);
          subscriber.complete();
        });
        return;
      }

      this.http.get('/assets/version.txt', {
        responseType: 'text',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }).pipe(
        tap(version => {
          this._targetVersion = version.trim();
          this._versionMismatch = this._targetVersion !== this._currentVersion;

          if (!this._versionMismatch) {
            sessionStorage.setItem(StorageKey.OutdatedVersionFunnelStep, this._targetVersion);
            subscriber.next(true);
            subscriber.complete();
            return;
          }

          this.openModal().result.finally(() => {
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

  private openModal(): NgbModalRef {
    const ref = this.ngbModal.open(OutdatedVersionComponent, { beforeDismiss: () => false });
    ref.componentInstance.currentVersion = this._currentVersion;
    ref.componentInstance.targetVersion = this._targetVersion;
    return ref;
  }
}
