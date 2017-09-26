import {NgModule} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {HomeComponent} from './home/home.component';
import {FooterModule} from '../footer/footer.module';
import {SharedModule} from '../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from './root/root.component';
import {HeaderModule} from '../header/header.module';
import {FooterBarService} from '../service/footer-bar.service';
import {LanguageSwitcherComponent} from './language-switcher/language-switcher.component';
import {InfoComponent} from './info/info.component';
import {SessionManagementComponent} from './session-management/session-management.component';
import {QuizManagerModule} from '../quiz-manager/quiz-manager.module';
import {ActiveQuestionGroupService} from '../service/active-question-group.service';
import {ModalsModule} from '../modals/modals.module';
import {WebsocketService} from '../service/websocket.service';
import {QuizFlowModule} from '../quiz-flow/quiz-flow.module';
import {ThemeSwitcherComponent} from './theme-switcher/theme-switcher.component';
import {ThemesModule} from '../themes/themes.module';
import {ConnectionService} from '../service/connection.service';
import {CurrentQuizService} from '../service/current-quiz.service';
import {NicknameChooserModule} from './nickname-chooser/nickname-chooser.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

const appRoutes: Routes = [
  // { path: 'crisis-center', component: CrisisListComponent },
  // { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'themes',
    component: ThemeSwitcherComponent,
    data: {}
  },
  {
    path: 'languages',
    component: LanguageSwitcherComponent,
    data: {}
  },
  {
    path: 'session-management',
    component: SessionManagementComponent,
    data: {}
  },
  {
    path: 'about',
    component: InfoComponent,
    data: {content: 'about'}
  },
  {
    path: 'tos',
    component: InfoComponent,
    data: {content: 'tos'}
  },
  {
    path: 'imprint',
    component: InfoComponent,
    data: {content: 'imprint'}
  },
  {
    path: 'dataprivacy',
    component: InfoComponent,
    data: {content: 'dataprivacy'}
  },
  {
    path: '',
    component: HomeComponent,
    data: {}
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
    InfoComponent,
    SessionManagementComponent,
    ThemeSwitcherComponent,
  ],
  imports: [
    SharedModule,
    ThemesModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false} // <-- debugging purposes only
    ),
    HeaderModule,
    FooterModule,
    QuizManagerModule,
    QuizFlowModule,
    NicknameChooserModule,
    ModalsModule,
    NgbModule.forRoot()
  ],
  exports: [],
  providers: [FooterBarService, ActiveQuestionGroupService, ConnectionService, WebsocketService, CurrentQuizService],
  entryComponents: [],
  bootstrap: [RootComponent]
})
export class RootModule {
}
