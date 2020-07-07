import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MemberGroupSelectComponent } from './member-group-select/member-group-select.component';
import { NicknameInputComponent } from './nickname-input/nickname-input.component';
import { NicknameSelectComponent } from './nickname-select/nickname-select.component';

const nicknameChooserRoutes: Routes = [
  {
    path: 'input',
    component: NicknameInputComponent,
    data: {},
  }, {
    path: 'select',
    component: NicknameSelectComponent,
    data: {},
  }, {
    path: 'memberGroup',
    component: MemberGroupSelectComponent,
    data: {},
  },
];

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(nicknameChooserRoutes),
  ],
  declarations: [
    NicknameInputComponent, NicknameSelectComponent, MemberGroupSelectComponent,
  ],
})
export class NicknameChooserModule {
}
