import {NgModule} from '@angular/core';
import {InfoComponent} from './info.component';
import {SharedModule} from '../../shared/shared.module';

import {RouterModule, Routes} from '@angular/router';

const infoRoutes: Routes = [
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
    redirectTo: 'about',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(infoRoutes),
  ],
  declarations: [InfoComponent]
})
export class InfoModule {
}
