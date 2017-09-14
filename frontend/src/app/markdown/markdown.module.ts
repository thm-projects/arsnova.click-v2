import { NgModule } from '@angular/core';
import { MarkdownBarComponent } from './markdown-bar/markdown-bar.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [MarkdownBarComponent],
  exports: [MarkdownBarComponent]
})
export class MarkdownModule { }
