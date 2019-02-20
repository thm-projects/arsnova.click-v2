import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private reg: ServiceWorkerRegistration;
  private readonly options: NotificationOptions = {
    icon: '/assets/images/theme/theme-Material/logo_s64x64.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    requireInteraction: true,
    actions: [
      {
        action: 'close',
        title: 'Close notification',
        icon: 'images/xmark.png',
      },
    ],
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  public async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    if (!this.reg) {
      this.reg = await navigator.serviceWorker.ready;
    }
    if (!this.reg || !title) {
      return;
    }
    // noinspection TypeScriptUnresolvedFunction
    const notificationPermission = await Notification.requestPermission();
    if (notificationPermission === 'granted') {
      return this.reg.showNotification(title, Object.assign({}, this.options, options));
    } else {
      console.error('cannot send notification', notificationPermission);
    }
  }
}
