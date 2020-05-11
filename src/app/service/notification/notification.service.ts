import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { TranslateService } from '@ngx-translate/core';
import { SimpleMQ } from 'ng2-simple-mq';
import { ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageKey } from '../../lib/enums/enums';
import { MessageProtocol } from '../../lib/enums/Message';
import { UserRole } from '../../lib/enums/UserRole';
import { IMessage } from '../../lib/interfaces/communication/IMessage';
import { NotificationApiService } from '../api/notification/notification-api.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { StorageService } from '../storage/storage.service';
import { ThemesService } from '../themes/themes.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _badgeAmount = 0;
  private readonly _vapidPublicKey = environment.vapidPublicKey;

  public readonly badge$: ReplaySubject<number> = new ReplaySubject<number>(1);
  public readonly footerBadges = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private swPush: SwPush,
    private themesService: ThemesService,
    private translate: TranslateService,
    private storageService: StorageService,
    private userService: UserService,
    private footerBarService: FooterBarService,
    private notificationApiService: NotificationApiService,
    private messageQueue: SimpleMQ,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.registerHandlers();

      this.userService.loginNotifier.pipe(filter(val => !val)).subscribe(() => this.clearFooterElemBadges());
    }
  }

  public async subscribeToNotifications(): Promise<void> {
    if (!this._vapidPublicKey ||
        !this.userService.isAuthorizedFor(UserRole.SuperAdmin) ||
        await this.storageService.db.Config.get(StorageKey.PushSubscription)
    ) {
      return;
    }

    this.swPush.requestSubscription({
        serverPublicKey: this._vapidPublicKey,
      })
      .then(sub => this.notificationApiService.addPushSubscriber(sub).subscribe(() => {
        this.storageService.db.Config.put({ type: StorageKey.PushSubscription, value: sub.toJSON() });
      }))
      .catch(err => console.error('Could not subscribe to notifications', err));
  }

  public modifyBadge(amount: number): void {
    if (isNaN(amount) && amount !== null && amount !== undefined) {
      throw new Error(`Invalid value for badge amount set: '${amount}'`);
    }

    this._badgeAmount += amount;
    this.badge$.next(this._badgeAmount);
  }

  public setBadgeForFooterElem(target: any, amount: any): void {
    this.footerBadges[target] = amount;
  }

  private clearFooterElemBadges(): void {
    Object.keys(this.footerBadges).forEach(elem => delete this.footerBadges[elem]);
  }

  private buildOptions(payload: any): NotificationOptions {
    return {
      icon: `/assets/images/theme/theme-${this.themesService.currentTheme}/logo_s64x64.png`,
      vibrate: [100, 50, 100],
      requireInteraction: true,
      body: this.translate.instant('notification.pending-pool-question.body', { amount: payload.amount }),
      tag: payload.tag,
      renotify: false,
      actions: [
        {
          action: 'close',
          title: this.translate.instant('notification.close'),
        },
      ],
    };
  }

  private registerHandlers(): void {
    if ('setAppBadge' in navigator) {
      // @ts-ignore
      this.badge$.subscribe(value => navigator.setAppBadge(value));
    }

    if ('serviceWorker' in navigator) {
      const serviceworker = navigator.serviceWorker;
      serviceworker.addEventListener('message', async (event) => {
        if (!event.data || typeof event.data !== 'string') {
          return;
        }

        const parsed: IMessage = JSON.parse(event.data);
        switch (parsed.step) {
          case MessageProtocol.PendingPoolQuestion:
            const reg = await serviceworker.getRegistration();
            const parsedAmount = parseInt(parsed.payload.amount, 10);

            if (parsedAmount > 0) {
              await reg.showNotification(this.translate.instant('notification.pending-pool-question.title', { amount: parsedAmount }),
                this.buildOptions({ ...parsed.payload, tag: `${parsed.step}_${parsedAmount}` }));

            } else {
              const notifications = await reg.getNotifications();
              notifications.filter(notification => notification.tag === parsed.step).forEach(notification => setTimeout(() => notification.close()));
            }
            break;
          case MessageProtocol.UpdateBadgeAmount:
            this.modifyBadge(parseInt(parsed.payload, 10));
            break;
          default:
            console.error('Unknown message from service worker received');
        }
      });
    }

    if (this.userService.isAuthorizedFor(UserRole.SuperAdmin)) {
      this.messageQueue.subscribe(MessageProtocol.UpdateBadgeAmount, payload => {
        this.setBadgeForFooterElem(payload.target, payload.amount);
      });
    }
  }
}
