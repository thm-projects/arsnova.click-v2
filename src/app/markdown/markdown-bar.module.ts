import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { MarkdownBarComponent } from './markdown-bar/markdown-bar.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [MarkdownBarComponent],
  exports: [MarkdownBarComponent],
})
export class MarkdownBarModule {
}
