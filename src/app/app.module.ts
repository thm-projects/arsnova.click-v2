import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, Inject, NgModule, PLATFORM_ID, SecurityContext } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { AppRoutingModule } from './app-routing.module';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { jwtOptionsFactory } from './lib/jwt.factory';
import { RoutePreloader } from './lib/route-preloader';
import { SvgBrowserLoader } from './lib/SvgBrowserLoader';
import { createTranslateCompiler, createUniversalTranslateLoader } from './lib/translation.factory';
import { ModalsModule } from './modals/modals.module';
import { PipesModule } from './pipes/pipes.module';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { LoginComponent } from './root/login/login.component';
import { RootComponent } from './root/root/root.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import { TwitterCardsComponent } from './root/twitter-cards/twitter-cards.component';
import rxStompConfig from './rx-stomp.config';
import { SentryErrorHandler } from './shared/sentry-error-handler';
import { SharedModule } from './shared/shared.module';


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
    BrowserModule.withServerTransition({ appId: 'arsnova-click' }),
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    BrowserTransferStateModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    ModalsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createUniversalTranslateLoader,
        deps: [TransferState, PLATFORM_ID, HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useFactory: createTranslateCompiler,
      },
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
      sanitize: SecurityContext.NONE,
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
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private rxStompService: RxStompService) {
    if (isPlatformServer(platformId)) {
      this.rxStompService.deactivate();
    }
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
