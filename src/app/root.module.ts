import { HttpClient } from '@angular/common/http';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Angulartics2Module } from 'angulartics2';
import { ToastrModule } from 'ngx-toastr';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { jwtOptionsFactory } from '../lib/jwt.factory';
import { RoutePreloader } from '../lib/route-preloader';
import { createTranslateLoader } from '../lib/translation.factory';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { ModalsModule } from './modals/modals.module';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { LoginComponent } from './root/login/login.component';
import { RootComponent } from './root/root/root.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import { AttendeeService } from './service/attendee/attendee.service';
import { ConnectionService } from './service/connection/connection.service';
import { FileUploadService } from './service/file-upload/file-upload.service';
import { FooterBarService } from './service/footer-bar/footer-bar.service';
import { HeaderLabelService } from './service/header-label/header-label.service';
import { I18nService } from './service/i18n/i18n.service';
import { CasLoginService } from './service/login/cas-login.service';
import { StaticLoginService } from './service/login/static-login.service';
import { QuestionTextService } from './service/question-text/question-text.service';
import { QuizService } from './service/quiz/quiz.service';
import { SettingsService } from './service/settings/settings.service';
import { SharedService } from './service/shared/shared.service';
import { IndexedDbService } from './service/storage/indexed.db.service';
import { StorageService } from './service/storage/storage.service';
import { ThemesService } from './service/themes/themes.service';
import { TrackingService } from './service/tracking/tracking.service';
import { UserService } from './service/user/user.service';
import { WebsocketService } from './service/websocket/websocket.service';
import { SharedModule } from './shared/shared.module';
import { ArsnovaClickAngulartics2Piwik } from './shared/tracking/ArsnovaClickAngulartics2Piwik';
import { ThemesModule } from './themes/themes.module';

export const appRoutes: Routes = [
  {
    path: 'admin',
    canLoad: [StaticLoginService],
    loadChildren: 'app/admin/admin.module#AdminModule',
  }, {
    path: 'info',
    loadChildren: 'app/root/info/info.module#InfoModule',
  }, {
    path: 'i18n-manager',
    canLoad: [StaticLoginService],
    loadChildren: 'app/i18n-manager/i18n-manager.module#I18nManagerModule',
  }, {
    path: 'quiz/manager',
    loadChildren: 'app/quiz/quiz-manager/quiz-manager.module#QuizManagerModule',
  }, {
    path: 'quiz/flow',
    loadChildren: 'app/quiz/quiz-flow/quiz-flow.module#QuizFlowModule',
    data: {
      preload: true,
    },
  }, {
    path: 'quiz',
    loadChildren: 'app/quiz/quiz.module#QuizModule',
  }, {
    path: 'nicks',
    loadChildren: 'app/root/nickname-chooser/nickname-chooser.module#NicknameChooserModule',
    data: {
      preload: true,
    },
  }, {
    path: 'themes',
    component: ThemeSwitcherComponent,
  }, {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
  }, {
    path: 'languages',
    component: LanguageSwitcherComponent,
  }, {
    path: 'login',
    component: LoginComponent,
  }, {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  }, {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  declarations: [
    HomeComponent, RootComponent, LanguageSwitcherComponent, ThemeSwitcherComponent, LoginComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'frontend' }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    BrowserTransferStateModule, // ServiceWorkerModule.register('/ngsw-worker.js', { enabled: true }),
    ModalsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler,
      },
    }),
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: RoutePreloader,
      enableTracing: false, // <-- debugging purposes only
    }),
    SharedModule,
    ThemesModule,
    HeaderModule,
    FooterModule,
    Angulartics2Module.forRoot(),
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [PLATFORM_ID],
      },
    }),
  ],
  providers: [
    /* {
     provide: ErrorHandler,
     useClass: GlobalErrorHandler,
     }, */
    RoutePreloader,
    IndexedDbService,
    StorageService,
    I18nService,
    FooterBarService,
    ConnectionService,
    QuizService,
    TranslateModule,
    CasLoginService,
    FileUploadService,
    SettingsService,
    NgbActiveModal,
    SharedService,
    AttendeeService,
    HeaderLabelService,
    QuestionTextService,
    ThemesService,
    ArsnovaClickAngulartics2Piwik,
    TrackingService,
    UserService,
    WebsocketService,
  ],
  exports: [TranslatePipe, TranslateModule],
  entryComponents: [],
  bootstrap: [RootComponent],
})
export class RootModule {
  constructor() {}
}
