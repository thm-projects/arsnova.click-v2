import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as IntroJs from 'intro.js';
import { IFooterBarElement } from '../../../lib/footerbar-element/interfaces';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingService } from '../../service/tracking/tracking.service';

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
export class RootComponent implements AfterViewInit {
  public static TYPE = 'RootComponent';

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
    private http: HttpClient,
  ) {
    (async () => {
      this.themesService.updateCurrentlyUsedTheme();
    })();

  }

  public getFooterBarElements(): Array<IFooterBarElement> {
    return this.footerBarService.footerElements;
  }

  public ngAfterViewInit(): void {
    this.router.events.subscribe((nav: any) => {
      if (nav instanceof NavigationEnd) {

        if (isPlatformServer(this.platformId)) {
          return;
        }

        this.initializeCookieConsent(nav.url);
      }
    });
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

  private getTooltipForRoute(route: string): void {
    let hasStartedIntroJs = false;
    const introState = JSON.parse(localStorage.getItem('config.intro-state')) || {};
    if (window.innerWidth <= 768) {
      return;
    }
    if (!introState[route]) {
      introState[route] = { completed: false, elements: {} };
      localStorage.setItem('config.intro-state', JSON.stringify(introState));
    }
    if (hasStartedIntroJs || !JSON.parse(localStorage.getItem('config.show-product-tour')) || introState[route].completed) {
      return;
    }
    const customIntroJs = IntroJs.introJs();
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
      localStorage.setItem('config.intro-state', JSON.stringify(introState));
    }).oncomplete(() => {
      introState[route].completed = true;
      hasStartedIntroJs = false;
      localStorage.setItem('config.intro-state', JSON.stringify(introState));
    });
  }

}
