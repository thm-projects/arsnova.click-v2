import { NgModule } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from '../shared/shared.module';
import { LivePreviewComponent } from './live-preview/live-preview.component';

@NgModule({
  imports: [
    SharedModule,
    HeaderModule,
  ],
  declarations: [LivePreviewComponent],
  exports: [LivePreviewComponent],
})
export class LivePreviewModule {
}
