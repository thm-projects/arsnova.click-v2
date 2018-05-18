import {NgModule} from '@angular/core';
import {FooterBarComponent} from './footer-bar/footer-bar.component';
import {SharedModule} from '../shared/shared.module';
import { AdditionalDataComponent } from './additional-data/additional-data.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [FooterBarComponent, AdditionalDataComponent],
  providers: [SharedModule],
  bootstrap: [FooterBarComponent],
  exports: [
    FooterBarComponent,
    AdditionalDataComponent
  ]
})
export class FooterModule {
}
