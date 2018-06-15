import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { LanguageLoaderService } from '../service/language-loader/language-loader.service';
import { StaticLoginService } from '../service/login/static-login.service';
import { ModalOrganizerService } from '../service/modal-organizer/modal-organizer.service';
import { ProjectLoaderService } from '../service/project-loader/project-loader.service';
import { SharedModule } from '../shared/shared.module';
import { I18nManagerOverviewComponent } from './i18n-manager-overview/i18n-manager-overview.component';
import { KeyOutputComponent } from './key-output/key-output.component';

const i18nManagerRoutes: Routes = [
  {
    path: 'i18n-manager',
    canActivate: [StaticLoginService],
    component: I18nManagerOverviewComponent,
  },
];

@NgModule({
  imports: [
    SharedModule, PipesModule, RouterModule.forChild(i18nManagerRoutes),
  ],
  declarations: [I18nManagerOverviewComponent, KeyOutputComponent],
  providers: [
    LanguageLoaderService, ProjectLoaderService, ModalOrganizerService,
  ],
})
export class I18nManagerModule {
}
