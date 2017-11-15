import {NgModule} from '@angular/core';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from '../shared/shared.module';
import {HeaderLabelService} from '../service/header-label.service';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [HeaderComponent],
  providers: [HeaderLabelService],
  bootstrap: [HeaderComponent]
})
export class HeaderModule {
}
