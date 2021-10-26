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
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public snackRef: any;
  private _badgeAmount = 0;
  private readonly _vapidPublicKey = environment.vapidPublicKey;

  public get vapidPublicKey(): string {
    return this._vapidPublicKey;
  }

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
    public snackBar: MatSnackBar
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.registerHandlers();

      this.userService.loginNotifier.pipe(filter(val => !val)).subscribe(() => this.clearFooterElemBadges());
    }
  }

  public show(message: string, action?: string, config?: MatSnackBarConfig) {
    const defaultConfig: MatSnackBarConfig = {
      duration: (action ? 25000 : 7000),
      panelClass: ['snackbar']
    };

    // Delegate the message and merge the (optionally) passed config with the default config
    this.snackRef = this.snackBar.open(message, action, Object.assign({}, defaultConfig, config));
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
      icon: `/assets/images/theme/${this.themesService.currentTheme}/logo_s64x64.png`,
      vibrate: [100, 50, 100],
      requireInteraction: true,
      body: payload.body,
      tag: payload.tag ?? String(Math.random()),
      renotify: true,
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
      console.log('Registering handler for app badge update');
      // @ts-ignore
      this.badge$.subscribe(value => navigator.setAppBadge(value));
    }

    if ('serviceWorker' in navigator) {
      console.log('Registering message handler in service worker');
      const serviceworker = navigator.serviceWorker;
      serviceworker.addEventListener('message', async (event) => {
        console.log('Message in sw received', event);
        if (!event.data || typeof event.data !== 'string') {
          return;
        }

        let options: object;
        const parsed: IMessage = JSON.parse(event.data);
        const reg = await serviceworker.getRegistration();

        switch (parsed.step) {
          case MessageProtocol.PendingPoolQuestion:
            const parsedAmount = parseInt(parsed.payload.amount, 10);

            if (parsedAmount > 0) {
              console.log('Showing push message for PendingPoolQuestion with parsedAmount', parsedAmount);

              options = this.buildOptions({
                ...parsed.payload,
                body: this.translate.instant('notification.pending-pool-question.body', { amount: parsedAmount })
              });
              await reg.showNotification(this.translate.instant('notification.pending-pool-question.title', { amount: parsedAmount }),
                options);

              console.log('Notification showed', options);
            } else {
              console.log('Showing generic push message for PendingPoolQuestion without parsedAmount');
            }
            break;
          case MessageProtocol.PoolQuestionApproved:
            console.log('Showing push message for PoolQuestionApproved');

            options = this.buildOptions({
              ...parsed.payload,
              body: this.translate.instant('notification.pool-question-approved.body')
            });
            await reg.showNotification(this.translate.instant('notification.pool-question-approved.title'),
              options);

            console.log('Notification showed', options);
            break;
          case MessageProtocol.UpdateBadgeAmount:
            console.log('Showing push message for UpdateBadgeAmount with parsedAmount', parsed.payload);

            this.modifyBadge(parseInt(parsed.payload, 10));

            console.log('Notification showed', options);
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
