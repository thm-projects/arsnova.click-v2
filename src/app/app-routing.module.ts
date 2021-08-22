import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './root/home/home.component';
import { LanguageSwitcherComponent } from './root/language-switcher/language-switcher.component';
import { LoginComponent } from './root/login/login.component';
import { ThemeSwitcherComponent } from './root/theme-switcher/theme-switcher.component';
import { InitDbGuard } from './service/init-db-guard/init-db.guard';
import { StaticLoginService } from './service/login/static-login.service';
import { OutdatedVersionGuardService } from './service/outdated-version-guard/outdated-version-guard.service';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [InitDbGuard, StaticLoginService],
  }, {
    path: 'info',
    loadChildren: () => import('./root/info/info.module').then(m => m.InfoModule),
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'i18n-manager',
    loadChildren: () => import('./i18n-manager/i18n-manager.module').then(m => m.I18nManagerModule),
    canActivate: [OutdatedVersionGuardService, InitDbGuard, StaticLoginService],
  }, {
    path: 'quiz/manager',
    loadChildren: () => import('./quiz/quiz-manager/quiz-manager.module').then(m => m.QuizManagerModule),
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'quiz/flow',
    loadChildren: () => import('./quiz/quiz-flow/quiz-flow.module').then(m => m.QuizFlowModule),
    data: {
      preload: false,
    },
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'quiz',
    loadChildren: () => import('./quiz/quiz.module').then(m => m.QuizModule),
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'nicks',
    loadChildren: () => import('./root/nickname-chooser/nickname-chooser.module').then(m => m.NicknameChooserModule),
    data: {
      preload: false,
    },
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'themes',
    component: ThemeSwitcherComponent,
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'preview/:themeId/:languageId',
    component: HomeComponent,
    data: { disableTwitter: true, disableStatistics: true },
    canActivate: [InitDbGuard],
  }, {
    path: 'languages',
    component: LanguageSwitcherComponent,
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: 'login',
    component: LoginComponent,
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: '',
    component: HomeComponent,
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  }, {
    path: '**',
    redirectTo: '/',
    canActivate: [OutdatedVersionGuardService, InitDbGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled', scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
