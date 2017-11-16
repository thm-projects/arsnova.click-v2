import {NgModule} from '@angular/core';
import {FooterBarComponent} from './footer-bar/footer-bar.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [FooterBarComponent],
  providers: [SharedModule],
  bootstrap: [FooterBarComponent],
  exports: [
    FooterBarComponent
  ]
})
export class FooterModule {
}
