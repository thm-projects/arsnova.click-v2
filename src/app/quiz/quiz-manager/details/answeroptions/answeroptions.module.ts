import { NgModule } from '@angular/core';
import { LivePreviewModule } from '../../../../live-preview/live-preview.module';
import { SharedModule } from '../../../../shared/shared.module';
import { AnsweroptionsDefaultComponent } from './answeroptions-default/answeroptions-default.component';
import { AnsweroptionsFreetextComponent } from './answeroptions-freetext/answeroptions-freetext.component';
import { AnsweroptionsRangedComponent } from './answeroptions-ranged/answeroptions-ranged.component';
import { AnsweroptionsComponent } from './answeroptions.component';

@NgModule({
  imports: [
    SharedModule, LivePreviewModule,
  ],
  declarations: [
    AnsweroptionsComponent, AnsweroptionsDefaultComponent, AnsweroptionsFreetextComponent, AnsweroptionsRangedComponent,
  ],
})
export class AnsweroptionsModule {
}
