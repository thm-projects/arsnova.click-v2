import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdditionalDataComponent } from './additional-data/additional-data.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';

@NgModule({
  imports: [SharedModule],
  declarations: [FooterBarComponent, AdditionalDataComponent],
  exports: [FooterBarComponent, AdditionalDataComponent],
})
export class FooterModule {
}
