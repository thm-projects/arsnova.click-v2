import { isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as introJs from 'intro.js';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { INamedType } from '../../../lib/interfaces';
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
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';

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

  public getFooterBarElements(): EventEmitter<Array<IFooterBarElement>> {
    return this.footerBarService.footerElements;
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

      this.getTooltipForRoute(currentUrl);
    });
  }

  private async getTooltipForRoute(route: string): Promise<void> {
    let hasStartedIntroJs = false;
    const introState = (await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.INTRO_STATE).toPromise()) || {};
    if (window.innerWidth <= 768) {
      return;
    }
    if (!introState[route]) {
      introState[route] = {
        completed: false,
        elements: {},
      };
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.INTRO_STATE, introState).subscribe();
    }
    if (hasStartedIntroJs || !await this.storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.SHOW_PRODUCT_TOUR).toPromise()
        || introState[route].completed) {
      return;
    }
    const customIntroJs = introJs();
    const introJsOptions = {
      'overlayOpacity': 0,
      'tooltipPosition': 'auto',
      'hidePrev': true,
      'hideNext': true,
      'showStepNumbers': false,
      'showBullets': false,
      'showProgress': false,
      'exitOnOverlayClick': true,
      'keyboardNavigation': false,
      'disableInteraction': false,
      'nextLabel': ' > ',
      'prevLabel': ' < ',
      'scrollToElement': true,
      'doneLabel': '',
      'skipLabel': '',
    };
    const key = this.translateService.instant('global.close_window');
    introJsOptions.doneLabel = key;
    introJsOptions.skipLabel = key;
    customIntroJs.setOptions(introJsOptions);

    const alreadyVisitedElements = Object.keys(introState[route].elements).length;
    if (alreadyVisitedElements > 0) {
      customIntroJs.goToStep(alreadyVisitedElements).start();
    } else {
      customIntroJs.start();
    }
    hasStartedIntroJs = true;
    customIntroJs.onafterchange((targetElement) => {
      introState[route].elements[targetElement.id] = true;
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.INTRO_STATE, introState).subscribe();
    }).oncomplete(() => {
      introState[route].completed = true;
      hasStartedIntroJs = false;
      this.storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.INTRO_STATE, introState).subscribe();
    });
  }

}
