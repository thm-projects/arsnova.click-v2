import {NgModule} from '@angular/core';
import {NicknameInputComponent} from './nickname-input/nickname-input.component';
import {NicknameSelectComponent} from './nickname-select/nickname-select.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';
import {CasService} from '../../service/cas.service';
import {MemberGroupSelectComponent} from './member-group-select/member-group-select.component';

const nicknameChooserRoutes: Routes = [
  {
    path: 'nicks/input',
    canActivate: [CasService],
    component: NicknameInputComponent,
    data: {}
  },
  {
    path: 'nicks/select',
    canActivate: [CasService],
    component: NicknameSelectComponent,
    data: {}
  },
  {
    path: 'nicks/memberGroup',
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
