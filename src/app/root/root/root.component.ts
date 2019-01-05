import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { INamedType } from '../../../lib/interfaces/interfaces';
// tslint:disable-next-line:max-line-length
import { QuizManagerDetailsOverviewComponent } from '../../quiz/quiz-manager/quiz-manager-details/quiz-manager-details-overview/quiz-manager-details-overview.component';
import { QuizManagerComponent } from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { StorageService } from '../../service/storage/storage.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';

// Update global window.* object interface (https://stackoverflow.com/a/12709880/7992104)
declare global {
  interface IWindow {
    cookieconsent?: {
      initialise: Function
    };
  }
}

declare interface IServerTarget {
  httpApiEndpoint: string;
  httpLibEndpoint: string;
  serverEndpoint: string;
  wsApiEndpoint: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, AfterViewInit {
  public static TYPE = 'RootComponent';
  public isInQuizManager = false;

  private _isLoading = true;

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private connectionService: ConnectionService,
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    private trackingService: TrackingService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private userService: UserService,
  ) {
  }

  public ngOnInit(): void {
    this.userService.loadConfig();
    this.router.events.subscribe((event: any) => {
      if (event instanceof RouteConfigLoadStart) {
        this._isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
        this._isLoading = false;
      }
    });

    /* Reload the page if the fetch of production chunks failed
     * https://stackoverflow.com/a/49805926
     */
    // Keep the original error handler
    const oldHandler = this.router.errorHandler;
    // Replace route error handler
    this.router.errorHandler = (err: any) => {
      // Check if there is an error loading the chunk
      if (err.originalStack && err.originalStack.indexOf('Error: Loading chunk') >= 0) {
        // Check if is the first time the error happend
        if (localStorage.getItem('lastChunkError') !== err.originalStack) {
          // Save the last error to avoid an infinite reload loop if the chunk really does not exists after reload
          localStorage.setItem('lastChunkError', err.originalStack);
          location.reload(true);
        } else {
          // The chunk really does not exists after reload
          console.error('We really don\'t find the chunk...');
        }
      }
      // Run original handler
      oldHandler(err);
    };
  }

  public ngAfterViewInit(): void {
    this.router.events.subscribe((nav: any) => {
      if (nav instanceof NavigationEnd) {

        if (isPlatformServer(this.platformId)) {
          return;
        }

        this.isInQuizManager = [QuizManagerComponent.TYPE, QuizManagerDetailsOverviewComponent.TYPE].includes(
          this.fetchChildComponent(this.activatedRoute).TYPE);

        this.initializeCookieConsent(nav.url);
      }
    });
  }

  private fetchChildComponent(route: ActivatedRoute): INamedType {
    return <INamedType>(route.firstChild ? this.fetchChildComponent(route.firstChild) : route.component);
  }

  private initializeCookieConsent(currentUrl): void {
    window.addEventListener('load', () => {
      if (!(<IWindow>window).cookieconsent) {
        return;
      }
      (<IWindow>window).cookieconsent.initialise({
        palette: {
          popup: {
            background: '#1d8a8a',
          },
          button: {
            background: 'transparent',
            text: '#62ffaa',
            border: '#62ffaa',
          },
        },
        position: 'bottom-right',
        content: {
          message: this.translateService.instant('global.cookie_consent.message'),
          dismiss: this.translateService.instant('global.cookie_consent.dismiss'),
          link: this.translateService.instant('global.cookie_consent.learn_more'),
          href: 'dataprivacy',
        },
      });

    });
  }
}
