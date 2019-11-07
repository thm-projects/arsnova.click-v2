import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';
import { I18nManagerOverviewComponent } from './i18n-manager-overview/i18n-manager-overview.component';
import { KeyOutputComponent } from './key-output/key-output.component';

const i18nManagerRoutes: Routes = [
  {
    path: '',
    component: I18nManagerOverviewComponent,
  },
];

@NgModule({
  imports: [
    SharedModule, PipesModule, RouterModule.forChild(i18nManagerRoutes), InfiniteScrollModule,
  ],
  declarations: [I18nManagerOverviewComponent, KeyOutputComponent],
  providers: [],
})
export class I18nManagerModule {
}
