import {AfterViewInit, Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';
import {TranslateService} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import * as IntroJs from 'intro.js';
import {I18nService} from '../../service/i18n.service';
import {TrackingService} from '../../service/tracking.service';
import {HttpClient} from '@angular/common/http';
import {DefaultSettings} from '../../../lib/default.settings';
import {ConnectionService} from '../../service/connection.service';
import {isPlatformServer} from '@angular/common';

// Update global window.* object interface (https://stackoverflow.com/a/12709880/7992104)
declare global {
  interface Window {
    cookieconsent: {
      initialise: Function
    };
    slowConnectionTimeout: number;
  }

  interface Document {
    ready: Function;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, AfterViewInit {
  public static TYPE = 'RootComponent';

  get loadCookieConsent(): boolean {
    return this._loadCookieConsent;
  }
  private _loadCookieConsent = false;

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
    private http: HttpClient
  ) {
    this.http.get('assets/serverEndpoint.json').subscribe((data: any) => {
      DefaultSettings.httpApiEndpoint = data.httpApiEndpoint;
      DefaultSettings.httpLibEndpoint = data.httpLibEndpoint;
      DefaultSettings.serverEndpoint = data.serverEndpoint;
      DefaultSettings.wsApiEndpoint = data.wsApiEndpoint;

      themesService.updateCurrentlyUsedTheme();
      this.i18nService.initLanguage();
    }, () => {

      themesService.updateCurrentlyUsedTheme();
      this.i18nService.initLanguage();
    });
  }

  getFooterBarElements() {
    return this.footerBarService.footerElements;
  }

  private getTooltipForRoute(route: string): void {
    let hasStartedIntroJs = false;
    const introState = JSON.parse(localStorage.getItem('config.intro-state')) || {};
    if (window.innerWidth <= 768) {
      return;
    }
    if (!introState[route]) {
      introState[route] = {completed: false, elements: {}};
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
      'skipLabel': ''
    };
    this.translateService.get('global.close_window').subscribe((res: string) => {
      introJsOptions.doneLabel = res;
      introJsOptions.skipLabel = res;
      customIntroJs.setOptions(introJsOptions);

      const alreadyVisitedElements = Object.keys(introState[route].elements).length;
      if (alreadyVisitedElements > 0) {
        customIntroJs.goToStep(alreadyVisitedElements).start();
      } else {
        customIntroJs.start();
      }
    });
    hasStartedIntroJs = true;
    customIntroJs.onafterchange(function (targetElement) {
      introState[route].elements[targetElement.id] = true;
      localStorage.setItem('config.intro-state', JSON.stringify(introState));
    }).oncomplete(function () {
      introState[route].completed = true;
      hasStartedIntroJs = false;
      localStorage.setItem('config.intro-state', JSON.stringify(introState));
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.router.events.subscribe((nav: any) => {
      if (nav instanceof NavigationEnd) {

        if (isPlatformServer(this.platformId)) {
          return;
        }

        window.addEventListener('load', () => {
          if (!window.cookieconsent) {
            return;
          }
          window.cookieconsent.initialise({
            palette: {
              popup: {
                background: '#1d8a8a'
              },
              button: {
                background: 'transparent',
                text: '#62ffaa',
                border: '#62ffaa'
              }
            },
            position: 'bottom-right',
            content: {
              message: this.translateService.instant('global.cookie_consent.message'),
              dismiss: this.translateService.instant('global.cookie_consent.dismiss'),
              link: this.translateService.instant('global.cookie_consent.learn_more'),
              href: 'dataprivacy'
            }
          });

          this.getTooltipForRoute(nav.url);
        });
      }
    });
  }

}
