import { NgModule } from '@angular/core';
import { AdditionalDataComponent } from './additional-data/additional-data.component';
import { FooterBarComponent } from './footer-bar/footer-bar.component';

@NgModule({
  declarations: [FooterBarComponent, AdditionalDataComponent],
  exports: [FooterBarComponent, AdditionalDataComponent],
})
export class FooterModule {
}
