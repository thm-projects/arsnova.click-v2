import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, ApplicationRef, Component, HostListener, Inject, OnInit, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { IMessage } from '@stomp/stompjs/esm6';
import { SimpleMQ } from 'ng2-simple-mq';
import { CookieService } from 'ngx-cookie-service';
import { EventReplayer } from 'preboot';
import { forkJoin, Observable, of, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, switchMapTo, take, takeUntil, tap } from 'rxjs/operators';
import { UniversalCookieConsentService } from 'universal-cookie-consent';
import { environment } from '../../../environments/environment';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { DbState, DeprecatedDb, DeprecatedKeys } from '../../lib/enums/enums';
import { StatusProtocol } from '../../lib/enums/Message';
import { QuizTheme } from '../../lib/enums/QuizTheme';
import { INamedType } from '../../lib/interfaces/interfaces';
import { IThemeHashMap } from '../../lib/interfaces/ITheme';
import { QuizManagerComponent } from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import { ThemesApiService } from '../../service/api/themes/themes-api.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { NotificationService } from '../../service/notification/notification.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, AfterViewInit {
  public static readonly TYPE = 'RootComponent';

  private _stompSubscription: Subscription;
  private _rendererInstance: Renderer2;
  private readonly _destroy = new Subject();

  public isInQuizManager = false;
  public isLoading = false;
  public readonly isServer = isPlatformServer(this.platformId);
  public readonly showInfoButtonsInFooter: boolean = environment.showInfoButtonsInFooter;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    public sharedService: SharedService,
    public footerBarService: FooterBarService,
    public twitterService: TwitterService,
    public connectionService: ConnectionService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private themeService: ThemesService,
    private updateCheckService: UpdateCheckService,
    private rxStompService: RxStompService,
    private storageService: StorageService,
    private quizService: QuizService,
    private messageQueue: SimpleMQ,
    private trackingService: TrackingService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private notificationService: NotificationService,
    private themesApiService: ThemesApiService,
    private appRef: ApplicationRef,
    private replayer: EventReplayer,
    private cookieService: CookieService,
    private cookieConsentService: UniversalCookieConsentService,
  ) {

    this._rendererInstance = this.rendererFactory.createRenderer(this.document, null);

    if (isPlatformBrowser(this.platformId)) {
      this.updateCheckService.checkForUpdates();

      let theme: QuizTheme;
      this.themeService.themeChanged.pipe(
        filter(t => !!t),
        map(themeName => String(themeName) === 'default' ? environment.defaultTheme : themeName),
        distinctUntilChanged(),
        tap(themeName => {
          theme = themeName;
          cookieService.delete('theme');
          cookieService.set('theme', themeName, 365000);
        }),
        switchMap(this.loadStyleHashMap.bind(this)),
        tap(data => this.themeService.themeHashes = data),
        map(data => data.find(value => value.theme === theme).hash),
        switchMap(hash => this.loadExternalStyles(`/theme-${theme}${hash ? '-' : ''}${hash}.css`)),
        switchMapTo(this.cookieConsentService.getGrantedConsents()),
        filter(consents => !consents?.includes('base')),
        takeUntil(this._destroy),
      ).subscribe(() => {
        this.initializeCookieConsent();
      });

      this.cookieConsentService.getGrantedConsents().pipe(
        filter(consents => !consents?.includes('base')),
        takeUntil(this._destroy),
      ).subscribe(() => {
        this.initializeCookieConsent();
      });

      this.cookieConsentService.getGrantedConsents().pipe(
        filter(consents => consents?.includes('analytics')),
        take(1),
        takeUntil(this._destroy),
      ).subscribe(() => {
        const matomoConfig = this.document.createElement('script');
        matomoConfig.innerText = 'window[\'_paq\'] = window[\'_paq\'] || [];';
        matomoConfig.type = 'text/javascript';
        this.document.body.appendChild(matomoConfig);

        const matomoScript = this.document.createElement('script');
        matomoScript.src = '/assets/piwik/piwik.js';
        matomoConfig.type = 'text/javascript';
        this.document.body.appendChild(matomoScript);
      });
    }

    this.sharedService.isLoadingEmitter.pipe(filter(() => isPlatformBrowser(this.platformId)), takeUntil(this._destroy))
      .subscribe((isLoading: boolean) => {
        setTimeout(() => this.isLoading = isLoading);
      });
  }

  public ngOnInit(): void {

    this.i18nService.initLanguage();
    this.themeService.initTheme();

    this.storageService.stateNotifier.pipe( //
      filter(val => val === DbState.Initialized && isPlatformBrowser(this.platformId)), //
      take(1), //
      takeUntil(this._destroy), //
    ).subscribe(() => {
      if (localStorage.getItem(DeprecatedKeys.hashtags)) {
        console.log('[RootComponent] Migrating legacy quiz data');
        this.migrateLegacyQuizData();
      }
      console.log('[RootComponent] Checking for deprecated databases');
      Object.values(DeprecatedDb).forEach(deprecatedDb => {
        indexedDB.deleteDatabase(deprecatedDb).addEventListener('success', () => {});
      });
    });

    this.cookieConsentService.getGrantedConsents().pipe(
      filter(consents => !consents?.includes('base')),
      switchMapTo(this.translateService.onLangChange),
      filter(() => isPlatformBrowser(this.platformId)),
      takeUntil(this._destroy),
    ).subscribe(() => {
      this.initializeCookieConsent();
    });

    this.router.events.pipe(takeUntil(this._destroy)).subscribe((event: any) => {
      if (event instanceof RouteConfigLoadStart) {
        this.sharedService.isLoadingEmitter.next(true);
        return;
      }

      this.sharedService.isLoadingEmitter.next(false);
    });

    this.storageService.stateNotifier.pipe(filter(val => val !== DbState.Destroy && isPlatformBrowser(this.platformId)), takeUntil(this._destroy))
      .subscribe(() => {
        this.themeService.updateCurrentlyUsedTheme();
      });

    this.quizService.quizUpdateEmitter.pipe(filter(() => !this.quizService.isInEditMode && isPlatformBrowser(this.platformId)),
      takeUntil(this._destroy)).subscribe((quiz: QuizEntity) => {
      if (this._stompSubscription) {
        console.log('RootComponent: Unsubscribing existing rxstomp subscription');
        this._stompSubscription.unsubscribe();
      }

      if (!quiz) {
        console.log('RootComponent: Quiz not found - not watching rxstomp channel');
        return;
      }

      this._stompSubscription = this.rxStompService.watch(`/exchange/quiz/${encodeURIComponent(quiz.name)}`).pipe(takeUntil(this._destroy))
        .subscribe(message => {
          console.log('Message in quiz channel received', message);
          this.onReceivedMessage(message);
        });
    });
  }

  public onReceivedMessage(message: IMessage): void {
    try {
      const parsedMessage = JSON.parse(message.body);
      let publishSuccess;
      if (parsedMessage.status !== StatusProtocol.Success || !parsedMessage.step) {
        publishSuccess = this.messageQueue.publish('error', parsedMessage, false);
      } else {
        if (typeof parsedMessage.payload === 'undefined') {
          parsedMessage.payload = {};
        }
        console.log('Publishing message with key', parsedMessage.step, parsedMessage.payload);
        publishSuccess = this.messageQueue.publish(parsedMessage.step, parsedMessage.payload, false);
      }
      console.log('Published message in quiz channel successfully', publishSuccess);
    } catch (e) {
      console.error('Invalid message in quiz channel', e.message);
    }
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.replayer.replayAll();

    window.addEventListener('appinstalled', () => {
      this.trackingService.trackConversionEvent({
        action: this.fetchChildComponent(this.activatedRoute).TYPE,
        label: 'WebApp installed',
      });
    });

    this.notificationService.subscribeToNotifications();

    this.router.events.pipe(takeUntil(this._destroy), filter(nav => nav instanceof NavigationEnd)).subscribe(() => {
      const currentComponent = this.fetchChildComponent(this.activatedRoute);
      if (!currentComponent) {
        this.router.navigate(['/']);
        return;
      }

      this.isInQuizManager = [QuizManagerComponent.TYPE].includes(currentComponent.TYPE);
    });
  }

  public toggleTweetsOpened(): void {
    this.trackingService.trackClickEvent({
      action: RootComponent.TYPE,
      label: this.twitterService.isShowingTwitter ? 'tweets-closed' : 'tweets-opened',
    });

    this.twitterService.showTwitter.next(!this.twitterService.isShowingTwitter);
  }

  public getClasses(): string {
    if (this.footerBarService.footerElements.length) {
      if (this.footerBarService.collapsedNavbar) {
        return 'col-sm-11 offset-sm-1';
      }

      return 'col-sm-11 offset-sm-1 col-md-10 offset-md-0 col-xl-9';
    }

    return 'col-12 col-sm-10 offset-sm-1 col-xl-8 offset-xl-2';
  }

  private fetchChildComponent(route: ActivatedRoute): INamedType {
    return <INamedType>(
      route.firstChild ? this.fetchChildComponent(route.firstChild) : route.component
    );
  }

  private loadStyleHashMap(): Observable<Array<IThemeHashMap>> {
    if (this.themeService.themeHashes) {
      return of(this.themeService.themeHashes);
    }
    return this.themesApiService.getThemeConfig();
  }

  private loadExternalStyles(styleUrl: string): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const existingNode = this._rendererInstance.selectRootElement('.theme-styles');

      console.log('existingnode', existingNode.href, styleUrl);
      if (existingNode.href.includes(styleUrl)) {
        subscriber.next(true);
        subscriber.complete();
        return;
      }
      const clone: HTMLLinkElement = existingNode.cloneNode() as HTMLLinkElement;
      this._rendererInstance.appendChild(this.document.head, clone);

      const css = new Image();
      css.onerror = () => {
        existingNode.href = styleUrl;
        console.log('moving href', existingNode.href, styleUrl);
        subscriber.next(true);
        subscriber.complete();

        setTimeout(() => {
          console.log('removing clone', clone.href, styleUrl);
          this._rendererInstance.removeChild(this.document.head, clone);
        }, 100);
      };
      css.src = styleUrl;
    });
  }

  private initializeCookieConsent(): void {

    this.cookieConsentService.show({
      consentTypes: [
        {
          id: 'base',
          title: this.translateService.instant('global.cookie_consent.base.title'),
          description: this.translateService.instant('global.cookie_consent.base.description'),
          mandatory: true,
        },
        {
          id: 'analytics',
          title: this.translateService.instant('global.cookie_consent.analytics.title'),
          description: this.translateService.instant('global.cookie_consent.analytics.description', { APP_NAME: environment.appName }),
          color: 'orange',
        },
      ],
      disableBodyScroll: true,
      introText: this.translateService.instant('global.cookie_consent.message', { APP_NAME: environment.appName }),
      acceptText: this.translateService.instant('global.cookie_consent.accept'),
      backText: this.translateService.instant('global.cookie_consent.back'),
      customizeText: this.translateService.instant('global.cookie_consent.customizeButton'),
      customizeHeadingText: this.translateService.instant('global.cookie_consent.customize'),
      saveText: this.translateService.instant('global.cookie_consent.save'),
      cookieSettings: {
        expires: 365,
      },
    });
  }

  private migrateLegacyQuizData(): void {
    try {
      this.storageService.stateNotifier.pipe(filter(val => val === DbState.Initialized), take(1), takeUntil(this._destroy)).subscribe(() => {
        const quizNames: Array<string> = JSON.parse(localStorage.getItem('hashtags'));
        new Promise(resolve => {
          if (!Array.isArray(quizNames)) {
            resolve();
            return;
          }
          forkJoin(quizNames.map(quizName => {
            const quiz = JSON.parse(localStorage.getItem(quizName));
            return this.quizService.saveParsedQuiz(quiz).pipe(tap(() => localStorage.removeItem(quizName)));
          })).subscribe(() => {
            resolve();
          });
        }).then(() => {
          Object.values(DeprecatedKeys).forEach(deprecatedKey => {
            localStorage.removeItem(deprecatedKey);
            sessionStorage.removeItem(deprecatedKey);
          });
        });
      });
    } catch {
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  private onKeydownHandler(event: KeyboardEvent): void {
    this.twitterService.showTwitter.next(false);
  }
}
