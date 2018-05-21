import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { FooterModule } from '../../footer/footer.module';
import { CasService } from '../../service/cas/cas.service';
import { SharedModule } from '../../shared/shared.module';
import { MemberGroupSelectComponent } from './member-group-select/member-group-select.component';
import { NicknameInputComponent } from './nickname-input/nickname-input.component';
import { NicknameSelectComponent } from './nickname-select/nickname-select.component';

const nicknameChooserRoutes: Routes = [
  {
    path: 'input',
    canActivate: [CasService],
    component: NicknameInputComponent,
    data: {},
  },
  {
    path: 'select',
    canActivate: [CasService],
    component: NicknameSelectComponent,
    data: {},
  },
  {
    path: 'memberGroup',
    component: MemberGroupSelectComponent,
    data: {},
  },
];

@NgModule({
  imports: [
    FooterModule,
    SharedModule,
    RouterModule.forChild(nicknameChooserRoutes),
  ],
  declarations: [
    NicknameInputComponent,
    NicknameSelectComponent,
    MemberGroupSelectComponent,
  ],
})
export class NicknameChooserModule {
}
