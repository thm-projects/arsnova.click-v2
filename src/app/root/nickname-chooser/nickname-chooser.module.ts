import {NgModule} from '@angular/core';
import {NicknameInputComponent} from './nickname-input/nickname-input.component';
import {NicknameSelectComponent} from './nickname-select/nickname-select.component';
import {SharedModule} from '../../shared/shared.module';
import {CasService} from '../../service/cas.service';
import {MemberGroupSelectComponent} from './member-group-select/member-group-select.component';

import {RouterModule, Routes} from '@angular/router';

const nicknameChooserRoutes: Routes = [
  {
    path: 'input',
    canActivate: [CasService],
    component: NicknameInputComponent,
    data: {}
  },
  {
    path: 'select',
    canActivate: [CasService],
    component: NicknameSelectComponent,
    data: {}
  },
  {
    path: 'memberGroup',
    component: MemberGroupSelectComponent,
    data: {}
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(nicknameChooserRoutes),
  ],
  declarations: [
    NicknameInputComponent,
    NicknameSelectComponent,
    MemberGroupSelectComponent
  ]
})
export class NicknameChooserModule {
}
