import {NgModule} from '@angular/core';
import {FooterBarComponent} from './footer-bar/footer-bar.component';
import {SharedModule} from '../shared/shared.module';
import {HttpModule} from '@angular/http';

@NgModule({
  imports: [
    SharedModule,
    HttpModule
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
