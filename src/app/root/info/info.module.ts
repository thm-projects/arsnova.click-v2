import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MarkdownModule } from 'ngx-markdown';
import { SharedModule } from '../../shared/shared.module';
import { InfoComponent } from './info.component';

const infoRoutes: Routes = [
  {
    path: 'about',
    component: InfoComponent,
    data: { content: 'about' },
  }, {
    path: 'tos',
    component: InfoComponent,
    data: { content: 'tos' },
  }, {
    path: 'imprint',
    component: InfoComponent,
    data: { content: 'imprint' },
  }, {
    path: 'dataprivacy',
    component: InfoComponent,
    data: { content: 'dataprivacy' },
  }, {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(infoRoutes), TranslateModule, MarkdownModule,
  ],
  declarations: [InfoComponent],
})
export class InfoModule {
}
