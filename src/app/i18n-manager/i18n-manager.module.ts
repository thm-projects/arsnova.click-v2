import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { LanguageLoaderService } from '../service/language-loader/language-loader.service';
import { ModalOrganizerService } from '../service/modal-organizer/modal-organizer.service';
import { ProjectLoaderService } from '../service/project-loader/project-loader.service';
import { SharedModule } from '../shared/shared.module';
import { I18nManagerComponent } from './i18n-manager/i18n-manager.component';
import { KeyOutputComponent } from './key-output/key-output.component';

const i18nManagerRoutes: Routes = [
  {
    path: 'i18n-manager',
    component: I18nManagerComponent,
  },
];

@NgModule({
  imports: [
    SharedModule, PipesModule, RouterModule.forChild(i18nManagerRoutes),
  ],
  declarations: [I18nManagerComponent, KeyOutputComponent],
  providers: [
    LanguageLoaderService, ProjectLoaderService, ModalOrganizerService,
  ],
})
export class I18nManagerModule {
}
