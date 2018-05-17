import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {HomeComponent} from './root/home/home.component';
import {FooterModule} from './footer/footer.module';
import {SharedModule} from './shared/shared.module';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {RootComponent} from './root/root/root.component';
import {HeaderModule} from './header/header.module';
import {FooterBarService} from './service/footer-bar.service';
import {LanguageSwitcherComponent} from './root/language-switcher/language-switcher.component';
import {ActiveQuestionGroupService} from './service/active-question-group.service';
import {ModalsModule} from './modals/modals.module';
import {WebsocketService} from './service/websocket.service';
import {ThemeSwitcherComponent} from './root/theme-switcher/theme-switcher.component';
import {ThemesModule} from './themes/themes.module';
import {ConnectionService} from './service/connection.service';
import {CurrentQuizService} from './service/current-quiz.service';
import {NicknameChooserModule} from './root/nickname-chooser/nickname-chooser.module';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {I18nService} from './service/i18n.service';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {createTranslateLoader} from '../lib/translation.factory';
import {CasService} from './service/cas.service';
import {UserService} from './service/user.service';
import {QuizModule} from './quiz/quiz.module';
import {FileUploadService} from './service/file-upload.service';
import {SettingsService} from './service/settings.service';
import {TrackingService} from './service/tracking.service';
import { Angulartics2Module } from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from './shared/tracking/ArsnovaClickAngulartics2Piwik';
import {SharedService} from './service/shared.service';

export const appRoutes: Routes = [
  {
    path: 'themes',
    component: ThemeSwitcherComponent,
  },
  {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
  },
  {
    path: 'info',
    loadChildren: 'app/root/info/info.module#InfoModule'
  },
  {
    path: 'quiz',
    loadChildren: 'app/quiz/quiz.module#QuizModule'
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
    ThemeSwitcherComponent
  ],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register('/ngsw-worker.js', {enabled: environment.production}),
    FormsModule,
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      },
      compiler: {
        provide: TranslateCompiler,
        useClass: TranslateMessageFormatCompiler
      }
    }),
    RouterModule.forRoot(
      appRoutes,
      {
        preloadingStrategy: PreloadAllModules,
        enableTracing: false // <-- debugging purposes only
      }
    ),
    SharedModule,
    ThemesModule,
    HeaderModule,
    FooterModule,
    QuizModule,
    NicknameChooserModule,
    ModalsModule,
    NgbModule.forRoot(),
    Angulartics2Module.forRoot([ArsnovaClickAngulartics2Piwik]),
  ],
  providers: [
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
    SharedService
  ],
  exports: [TranslatePipe, TranslateModule],
  entryComponents: [],
  bootstrap: [RootComponent]
})
export class RootModule {
}
