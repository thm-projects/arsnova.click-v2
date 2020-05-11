import { DOCUMENT, isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, HostListener, Inject, OnInit, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { IMessage } from '@stomp/stompjs/esm6';
import { SimpleMQ } from 'ng2-simple-mq';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil, tap } from 'rxjs/operators';
import themeData from '../../../assets/themeData.json';
import { environment } from '../../../environments/environment';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { DbState, DeprecatedDb, DeprecatedKeys } from '../../lib/enums/enums';
import { StatusProtocol } from '../../lib/enums/Message';
import { QuizTheme } from '../../lib/enums/QuizTheme';
import { INamedType } from '../../lib/interfaces/interfaces';
import { IWindow } from '../../lib/interfaces/IWindow';
import { QuizManagerComponent } from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import { ConnectionService } from '../../service/connection/connection.service';
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    public sharedService: SharedService,
    public twitterService: TwitterService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private themeService: ThemesService,
    private updateCheckService: UpdateCheckService,
    private rxStompService: RxStompService,
    private storageService: StorageService,
    private quizService: QuizService,
    private connectionService: ConnectionService,
    private messageQueue: SimpleMQ,
    private trackingService: TrackingService,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document,
    private notificationService: NotificationService,
  ) {

    this._rendererInstance = this.rendererFactory.createRenderer(this.document, null);

    this.themeService.themeChanged.pipe(filter(t => !!t && isPlatformBrowser(this.platformId)), distinctUntilChanged(), takeUntil(this._destroy))
      .subscribe((themeName: QuizTheme) => {
        if (String(themeName) === 'default') {
          themeName = environment.defaultTheme;
        }
        this.loadExternalStyles(`/theme-${themeName}.css`).then(() => {
          this.initializeCookieConsent(themeName);
        }).catch(reason => {
          console.log('RootComponent: theme loading failed', reason, themeName, document.getElementById('theme-styles'));
        });
      });

    if (isPlatformBrowser(this.platformId)) {
      this.updateCheckService.checkForUpdates();
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
      if (localStorage.getItem('hashtags')) {
        console.log('[RootComponent] Migrating legacy quiz data');
        this.migrateLegacyQuizData();
      }
      console.log('[RootComponent] Checking for deprecated databases');
      Object.values(DeprecatedDb).forEach(deprecatedDb => {
        indexedDB.deleteDatabase(deprecatedDb).addEventListener('success', () => {});
      });
    });

    this.translateService.onLangChange.pipe(filter(() => isPlatformBrowser(this.platformId)), takeUntil(this._destroy)).subscribe(() => {
      this.initializeCookieConsent(this.themeService.currentTheme);
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
        this._stompSubscription.unsubscribe();
      }

      if (!quiz) {
        return;
      }

      this._stompSubscription = this.rxStompService.watch(`/exchange/quiz_${encodeURIComponent(quiz.name)}`).pipe(takeUntil(this._destroy))
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

  private fetchChildComponent(route: ActivatedRoute): INamedType {
    return <INamedType>(
      route.firstChild ? this.fetchChildComponent(route.firstChild) : route.component
    );
  }

  private loadExternalStyles(styleUrl: string): Promise<void> {
    return new Promise(resolve => {
      const existingNode = this._rendererInstance.selectRootElement('.theme-styles');
      if (existingNode.href.includes(styleUrl)) {
        resolve();
        return;
      }
      existingNode.href = styleUrl;
      resolve();
    });
  }

  private initializeCookieConsent(theme: QuizTheme): void {
    if (!(
      <IWindow>window
    ).cookieconsent || !theme || document.cookie.includes('cookieconsent_status=dismiss')) {
      return;
    }

    const elements = document.getElementsByClassName('cc-window');
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).remove();
    }

    console.log('initializing cookie consent with theme', theme);

    (
      <IWindow>window
    ).cookieconsent.initialise({
      palette: {
        popup: {
          background: themeData[theme].quizNameRowStyle.bg,
        },
        button: {
          background: 'transparent',
          text: themeData[theme].exportedAtRowStyle.fg,
          border: themeData[theme].exportedAtRowStyle.fg,
        },
      },
      theme: 'classic',
      position: 'bottom-right',
      content: {
        message: this.translateService.instant('global.cookie_consent.message'),
        dismiss: this.translateService.instant('global.cookie_consent.dismiss'),
        link: this.translateService.instant('global.cookie_consent.learn_more'),
        href: 'dataprivacy',
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
