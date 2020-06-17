import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateCheckService {
  private swUpdateToast: ActiveToast<any>;
  private readonly INTERVAL_PERIOD = 21600;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private updates: SwUpdate,
    private translateService: TranslateService,
    private toastService: ToastrService
  ) {
    if (updates.isEnabled) {
      interval(this.INTERVAL_PERIOD).subscribe(() => this.doCheck().then(() => console.log('checking for updates')));
    }
  }

  public checkForUpdates(): void {
    this.updates.available.subscribe(event => this.promptUser(event));
  }

  public doCheck(): Promise<void> {
    return this.updates.checkForUpdate();
  }

  public async clearCache(): Promise<Array<boolean>> {
    const caches = await window.caches.keys();
    if (!caches?.length) {
      return [];
    }

    return Promise.all(caches.map(key => window.caches.delete(key)));
  }

  public reloadPage(): void {
    document.location.reload(true);
  }

  private promptUser(availableEvent: UpdateAvailableEvent): void {
    console.log('UpdateCheckService: service worker update available');
    console.log('UpdateCheckService: current version is', availableEvent.current);
    console.log('UpdateCheckService: available version is', availableEvent.available);
    console.log('UpdateCheckService: event type is', availableEvent.type);

    if (this.swUpdateToast) {
      this.toastService.remove(this.swUpdateToast.toastId);
    }

    const message = this.translateService.instant('component.toasts.swupdate.message');
    const title = this.translateService.instant('component.toasts.swupdate.title');

    this.swUpdateToast = this.toastService.info(message, title, {
      disableTimeOut: true,
      toastClass: 'toast show ngx-toastr',
    });

    this.swUpdateToast.onTap.subscribe(() => {
      this.clearCache().finally(() => {
        this.updates.activateUpdate().then(() => this.reloadPage());
      });
    });

    console.log('updating to new version');

    this.updates.activated.subscribe(activatedEvent => {
      console.log('UpdateCheckService: previous version was', activatedEvent.previous);
      console.log('UpdateCheckService: current version is', activatedEvent.current);
      console.log('UpdateCheckService: event type is', activatedEvent.type);
    });
  }
}
