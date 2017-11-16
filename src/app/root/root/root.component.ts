import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FooterBarService} from '../../service/footer-bar.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';
import {TranslateService} from '@ngx-translate/core';
import {NavigationEnd, Router} from '@angular/router';
import * as IntroJs from 'intro.js';
import {I18nService} from '../../service/i18n.service';
import {TrackingService} from '../../service/tracking.service';

// Update global window.* object interface (https://stackoverflow.com/a/12709880/7992104)
declare global {
  interface Window {
    cookieconsent: {
      initialise: Function
    };
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
  get loadCookieConsent(): boolean {
    return this._loadCookieConsent;
  }
  private _loadCookieConsent = false;

  constructor(
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    private trackingService: TrackingService,
    private footerBarService: FooterBarService,
    private headerLabelService: HeaderLabelService,
    private themesService: ThemesService,
    private translateService: TranslateService,
    private router: Router) {
    themesService.updateCurrentlyUsedTheme();
    trackingService.trackPageView('RootComponent');
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
