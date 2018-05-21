import { NgModule } from '@angular/core';
import { ThemesService } from '../service/themes/themes.service';
import { SharedModule } from '../shared/shared.module';
import { ThemesComponent } from './themes.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [ThemesComponent],
  declarations: [ThemesComponent],
  providers: [ThemesService],
})
export class ThemesModule {
}
