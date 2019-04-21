import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DeprecatedDb, DeprecatedKeys } from '../../../lib/enums/enums';
import { INamedType } from '../../../lib/interfaces/interfaces';
import { IWindow } from '../../../lib/interfaces/IWindow';
import { QuizManagerComponent } from '../../quiz/quiz-manager/quiz-manager/quiz-manager.component';
import { I18nService } from '../../service/i18n/i18n.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesService } from '../../service/themes/themes.service';
import { UserService } from '../../service/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit, AfterViewInit {
  public static TYPE = 'RootComponent';
  public isInQuizManager = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public i18nService: I18nService, // Must be instantiated here to be available in all child components
    public sharedService: SharedService,
    private translateService: TranslateService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService, // private swUpdate: SwUpdate,
    private toastService: ToastrService,
    private themeService: ThemesService,
  ) {
    this.themeService.themeChanged.subscribe(themeName => {
      this.loadExternalStyles(`/${themeName}.css`).then(() => {
      }).catch(reason => {
        console.log('RootComponent: theme loading failed', reason, themeName, document.getElementById('theme-styles'));
      });
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

    this.translateService.onLangChange.subscribe(() => {
      this.initializeCookieConsent();
      this.initializeUpdateToastr();
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof RouteConfigLoadStart) {
        this.sharedService.isLoadingEmitter.next(true);
      } else if (event instanceof RouteConfigLoadEnd) {
        this.sharedService.isLoadingEmitter.next(false);
      }
    });
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.router.events.subscribe((nav: any) => {
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

  private initializeCookieConsent(): void {
    if (!(<IWindow>window).cookieconsent) {
      return;
    }

    const elements = document.getElementsByClassName('cc-window');
    for (let i = 0; i < elements.length; i++) {
      elements.item(i).remove();
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
  }

  private initializeUpdateToastr(): void {
    /*
     if (!this.swUpdate.isEnabled) {
     return;
     }

     let swUpdateToast: ActiveToast<any>;

     this.swUpdate.available.subscribe((event) => {
     console.log('RootComponent: service worker update available');
     console.log('RootComponent: current version is', event.current);
     console.log('RootComponent: available version is', event.available);
     console.log('RootComponent: event type is', event.type);

     if (swUpdateToast) {
     this.toastService.remove(swUpdateToast.toastId);
     }

     const message = this.translateService.instant('component.toasts.swupdate.message');
     const title = this.translateService.instant('component.toasts.swupdate.title');
     swUpdateToast = this.toastService.info(message, title, {
     disableTimeOut: true,
     toastClass: 'toast show ngx-toastr',
     });
     swUpdateToast.onTap.subscribe(() => {
     this.swUpdate.activateUpdate().then(() => document.location.reload());
     });

     });
     this.swUpdate.activated.subscribe(event => {
     console.log('RootComponent: previous version was', event.previous);
     console.log('RootComponent: current version is', event.current);
     console.log('RootComponent: event type is', event.type);
     });
     this.swUpdate.checkForUpdate().then(() => {
     }).catch((err) => {
     console.error('RootComponent: error while checking for update', err);
     });
     */
  }
}
