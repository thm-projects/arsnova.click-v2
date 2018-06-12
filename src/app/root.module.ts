import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule, Routes } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { Angulartics2Module } from 'angulartics2';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { environment } from '../environments/environment';
import { RoutePreloader } from '../lib/route-preloader';
import { createTranslateLoader } from '../lib/translation.factory';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { ModalsModule } from './modals/modals.module';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { RootComponent } from './root/root/root.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import { ActiveQuestionGroupService } from './service/active-question-group/active-question-group.service';
import { AttendeeService } from './service/attendee/attendee.service';
import { CasService } from './service/cas/cas.service';
import { ConnectionService } from './service/connection/connection.service';
import { CurrentQuizService } from './service/current-quiz/current-quiz.service';
import { FileUploadService } from './service/file-upload/file-upload.service';
import { FooterBarService } from './service/footer-bar/footer-bar.service';
import { HeaderLabelService } from './service/header-label/header-label.service';
import { I18nService } from './service/i18n/i18n.service';
import { SettingsService } from './service/settings/settings.service';
import { SharedService } from './service/shared/shared.service';
import { TrackingService } from './service/tracking/tracking.service';
import { UserService } from './service/user/user.service';
import { WebsocketService } from './service/websocket/websocket.service';
import { GlobalErrorHandler } from './shared/error-handler';
import { SharedModule } from './shared/shared.module';
import { ArsnovaClickAngulartics2Piwik } from './shared/tracking/ArsnovaClickAngulartics2Piwik';
import { ThemesModule } from './themes/themes.module';

export const appRoutes: Routes = [
  {
    path: 'info',
    loadChildren: 'app/root/info/info.module#InfoModule',
  },
  {
    path: 'quiz/manager',
    loadChildren: 'app/quiz/quiz-manager/quiz-manager.module#QuizManagerModule',
  },
  {
    path: 'quiz/flow',
    loadChildren: 'app/quiz/quiz-flow/quiz-flow.module#QuizFlowModule',
    data: {
      preload: true,
    },
  },
  {
    path: 'nicks',
    loadChildren: 'app/root/nickname-chooser/nickname-chooser.module#NicknameChooserModule',
    data: {
      preload: true,
    },
  },
  {
    path: 'quiz',
    loadChildren: 'app/quiz/quiz.module#QuizModule',
  },
  {
    path: 'themes',
    component: ThemeSwitcherComponent,
  },
  {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
  },
  {
    path: 'languages',
    component: LanguageSwitcherComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  /*
   { path: '',
   redirectTo: '/home',
   pathMatch: 'full'
   },
   */
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    RootComponent,
    LanguageSwitcherComponent,
    ThemeSwitcherComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'frontend' }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FormsModule,
    CommonModule,
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
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: RoutePreloader,
        enableTracing: false, // <-- debugging purposes only
      },
    ),
    SharedModule,
    ThemesModule,
    HeaderModule,
    FooterModule,
    ModalsModule,
    NgbModule.forRoot(),
    Angulartics2Module.forRoot([ArsnovaClickAngulartics2Piwik]),
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    RoutePreloader,
    I18nService,
    FooterBarService,
    ActiveQuestionGroupService,
    ConnectionService,
    WebsocketService,
    CurrentQuizService,
    TranslateModule,
    UserService,
    CasService,
    FileUploadService,
    SettingsService,
    NgbActiveModal,
    TrackingService,
    SharedService,
    AttendeeService,
    HeaderLabelService,
  ],
  exports: [TranslatePipe, TranslateModule],
  entryComponents: [],
  bootstrap: [RootComponent],
})
export class RootModule {
  constructor() {}
}
