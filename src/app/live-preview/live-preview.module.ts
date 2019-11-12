import { NgModule } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { HeaderModule } from '../header/header.module';
import { SharedModule } from '../shared/shared.module';
import { LivePreviewComponent } from './live-preview/live-preview.component';

@NgModule({
  imports: [
    SharedModule, HeaderModule, MarkdownModule,
  ],
  declarations: [LivePreviewComponent],
  exports: [LivePreviewComponent],
})
export class LivePreviewModule {
}
