import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {ThemesComponent} from './themes.component';
import {ThemesService} from '../service/themes.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [ThemesComponent],
  declarations: [ThemesComponent],
  providers: [ThemesService]
})
export class ThemesModule {
}
