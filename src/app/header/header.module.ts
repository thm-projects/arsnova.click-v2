import { NgModule } from '@angular/core';
import { ModalsModule } from '../modals/modals.module';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    ModalsModule, SharedModule,
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [HeaderComponent],
  providers: [],
  bootstrap: [HeaderComponent],
})
export class HeaderModule {
}
