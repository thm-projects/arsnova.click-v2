import {NgModule} from '@angular/core';
import {NicknameInputComponent} from './nickname-input/nickname-input.component';
import {NicknameSelectComponent} from './nickname-select/nickname-select.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule, Routes} from '@angular/router';

const nicknameChooserRoutes: Routes = [
  {
    path: 'nicks/input',
    component: NicknameInputComponent,
    data: {}
  },
  {
    path: 'nicks/select',
    component: NicknameSelectComponent,
    data: {}
  },
];

@NgModule({
            imports: [
              SharedModule,
              RouterModule.forChild(nicknameChooserRoutes),
            ],
            declarations: [NicknameInputComponent, NicknameSelectComponent]
          })
export class NicknameChooserModule {
}
