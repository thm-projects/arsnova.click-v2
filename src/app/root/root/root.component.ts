import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import themeData from '../../../assets/themeData.json';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DeprecatedDb, DeprecatedKeys } from '../../../lib/enums/enums';
import { StatusProtocol } from '../../../lib/enums/Message';
import { QuizTheme } from '../../../lib/enums/QuizTheme';
import { INamedType } from '../../../lib/interfaces/interfaces';
import { IWindow } from '../../../lib/interfaces/IWindow';
import { QuizManagerComponent } from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import { ConnectionService } from '../../service/connection/connection.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesService } from '../../service/themes/themes.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, AfterViewInit {
  public static TYPE = 'RootComponent';
  public isInQuizManager = false;
  public isLoading = true;
  private _stompSubscription: Subscription;
  private readonly _destroy = new Subject();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    public sharedService: SharedService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private themeService: ThemesService,
    private updateCheckService: UpdateCheckService,
    private rxStompService: RxStompService,
    private quizService: QuizService,
    private connectionService: ConnectionService, private messageQueue: SimpleMQ,
  ) {
    this.themeService.themeChanged.pipe(takeUntil(this._destroy)).subscribe(themeName => {
      this.loadExternalStyles(`/theme-${themeName}.css`).then(() => {
        this.initializeCookieConsent(themeName);
      }).catch(reason => {
        console.log('RootComponent: theme loading failed', reason, themeName, document.getElementById('theme-styles'));
      });
    });
    this.updateCheckService.checkForUpdates();
    this.sharedService.isLoadingEmitter.pipe(takeUntil(this._destroy)).subscribe(isLoading => {
      setTimeout(() => this.isLoading = isLoading);
    });
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      Object.values(DeprecatedKeys).forEach(deprecatedKey => {
        localStorage.removeItem(deprecatedKey);
        sessionStorage.removeItem(deprecatedKey);
      });
      Object.values(DeprecatedDb).forEach(deprecatedDb => {
        indexedDB.deleteDatabase(deprecatedDb).addEventListener('success', () => {});
      });
    }

    this.userService.loadConfig();

    this.translateService.onLangChange.pipe(takeUntil(this._destroy)).subscribe(() => {
      this.initializeCookieConsent(this.themeService.currentTheme);
    });

    this.router.events.pipe(takeUntil(this._destroy)).subscribe((event: any) => {
      if (event instanceof RouteConfigLoadStart) {
        this.sharedService.isLoadingEmitter.next(true);
      } else if (event instanceof RouteConfigLoadEnd || event instanceof NavigationEnd) {
        this.sharedService.isLoadingEmitter.next(false);
      }
    });

    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe((quiz: QuizEntity) => {
      if (this._stompSubscription) {
        this._stompSubscription.unsubscribe();
      }

      if (!quiz) {
        return;
      }

      this._stompSubscription = this.rxStompService.watch(`/exchange/quiz_${encodeURI(quiz.name)}`).pipe(takeUntil(this._destroy))
      .subscribe(message => {
        console.log('Message in quiz channel received', message);
        try {
          const parsedMessage = JSON.parse(message.body);
          if (parsedMessage.status !== StatusProtocol.Success || !parsedMessage.step) {
            this.messageQueue.publish('error', parsedMessage);
          } else {
            if (typeof parsedMessage.payload === 'undefined') {
              parsedMessage.payload = {};
            }
            this.messageQueue.publish(parsedMessage.step, parsedMessage.payload);
          }
        } catch (e) {
          console.error('Invalid message in quiz channel', e.message);
        }
      });
    });
  }

  public onSendMessage(): void {
    const message = `Message generated at ${new Date}`;
    this.rxStompService.publish({
      destination: '/topic/demo',
      body: message,
    });
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
      event.prompt();
    });

    this.router.events.pipe(takeUntil(this._destroy)).subscribe((nav: any) => {
      if (nav instanceof NavigationEnd) {

        this.isInQuizManager = [QuizManagerComponent.TYPE].includes(this.fetchChildComponent(this.activatedRoute).TYPE);
      }
    });
  }

  private fetchChildComponent(route: ActivatedRoute): INamedType {
    return <INamedType>(route.firstChild ? this.fetchChildComponent(route.firstChild) : route.component);
  }

  private loadExternalStyles(styleUrl: string): Promise<Event> {
    return new Promise(resolve => {
      const existingNode = document.getElementsByClassName('theme-styles');
      if (existingNode.length) {
        if ((existingNode.item(0) as HTMLLinkElement).href.includes(styleUrl)) {
          return;
        }
      }

      const styleElement = document.createElement('link') as HTMLLinkElement;
      styleElement.classList.add('theme-styles');
      styleElement.rel = 'stylesheet';
      styleElement.href = styleUrl;
      styleElement.onload = () => {
        document.head.removeChild(existingNode.item(0));
        resolve();
      };
      document.head.appendChild(styleElement);
    });
  }

  private initializeCookieConsent(theme: QuizTheme): void {
    if (!(<IWindow>window).cookieconsent || !theme) {
      return;
    }

    const elements = document.getElementsByClassName('cc-window');
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).remove();
    }

    (<IWindow>window).cookieconsent.initialise({
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
}
