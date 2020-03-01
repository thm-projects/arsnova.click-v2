import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { AngularSvgIconModule, SvgLoader } from 'angular-svg-icon';
import { Angulartics2Module } from 'angulartics2';
import { SimpleMQ } from 'ng2-simple-mq';
import { MarkdownModule, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { jwtOptionsFactory } from './lib/jwt.factory';
import { RoutePreloader } from './lib/route-preloader';
import { SvgBrowserLoader } from './lib/SvgBrowserLoader';
import { createTranslateCompiler, createTranslateLoader } from './lib/translation.factory';
import { ModalsModule } from './modals/modals.module';
import { PipesModule } from './pipes/pipes.module';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { LoginComponent } from './root/login/login.component';
import { RootComponent } from './root/root/root.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import { TwitterCardsComponent } from './root/twitter-cards/twitter-cards.component';
import rxStompConfig from './rx-stomp.config';
import { InitDbGuard } from './service/init-db-guard/init-db.guard';
import { StaticLoginService } from './service/login/static-login.service';
import { SentryErrorHandler } from './shared/sentry-error-handler';
import { SharedModule } from './shared/shared.module';

const appRoutes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [InitDbGuard, StaticLoginService],
  }, {
    path: 'info',
    loadChildren: () => import('./root/info/info.module').then(m => m.InfoModule),
    canActivate: [InitDbGuard],
  }, {
    path: 'i18n-manager',
    loadChildren: () => import('./i18n-manager/i18n-manager.module').then(m => m.I18nManagerModule),
    canActivate: [InitDbGuard, StaticLoginService],
  }, {
    path: 'quiz/manager',
    loadChildren: () => import('./quiz/quiz-manager/quiz-manager.module').then(m => m.QuizManagerModule),
    canActivate: [InitDbGuard],
  }, {
    path: 'quiz/flow',
    loadChildren: () => import('./quiz/quiz-flow/quiz-flow.module').then(m => m.QuizFlowModule),
    data: {
      preload: false,
    },
    canActivate: [InitDbGuard],
  }, {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule),
    canActivate: [InitDbGuard],
  }, {
    path: 'nicks',
    loadChildren: () => import('./root/nickname-chooser/nickname-chooser.module').then(m => m.NicknameChooserModule),
    data: {
      preload: false,
    },
    canActivate: [InitDbGuard],
  }, {
    path: 'themes',
    component: ThemeSwitcherComponent,
    canActivate: [InitDbGuard],
  }, {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
    canActivate: [InitDbGuard],
  }, {
    path: 'languages',
    component: LanguageSwitcherComponent,
    canActivate: [InitDbGuard],
  }, {
    path: 'login',
    component: LoginComponent,
    canActivate: [InitDbGuard],
  }, {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    canActivate: [InitDbGuard],
  }, {
    path: '**',
    redirectTo: '/',
    canActivate: [InitDbGuard],
  },
];

// function that returns `MarkedOptions` with renderer override
export function markedOptionsFactory(): MarkedOptions {
  const renderer = new MarkedRenderer();
  renderer.paragraph = (text) => `${text}<br/>`;

  return {
    renderer: renderer,
    gfm: true,
    breaks: true,
    pedantic: false,
    smartLists: true,
    smartypants: false,
  };
}

export function svgLoaderFactory(http: HttpClient, transferState: TransferState): SvgBrowserLoader {
  return new SvgBrowserLoader(transferState, http);
}

@NgModule({
  declarations: [
    HomeComponent, RootComponent, LanguageSwitcherComponent, ThemeSwitcherComponent, LoginComponent, TwitterCardsComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ModalsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useFactory: createTranslateCompiler,
      },
    }),
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: RoutePreloader,
      enableTracing: false, // <-- debugging purposes only
    }),
    FooterModule,
    SharedModule,
    Angulartics2Module.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID],
      },
    }),
    PipesModule,
    HeaderModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useFactory: (
          markedOptionsFactory
        ),
      },
    }),
    AngularSvgIconModule.forRoot({
      loader: {
        provide: SvgLoader,
        useFactory: svgLoaderFactory,
        deps: [HttpClient, TransferState],
      },
    }),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: SentryErrorHandler,
    }, {
      provide: InjectableRxStompConfig,
      useValue: rxStompConfig,
    }, {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    }, SimpleMQ, RoutePreloader, NgbActiveModal,
  ],
  bootstrap: [RootComponent],
})
export class RootModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(platformId) && environment.production) {
      (
        window as any
      ).console = {
        log: function (): void {},
        info: function (): void {},
        trace: function (): void {},
        warn: window.console.warn,
        error: window.console.error,
      };
    }
  }
}
