import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {AnsweroptionsComponent} from './answeroptions.component';
import {AnsweroptionsDefaultComponent} from './answeroptions-default/answeroptions-default.component';
import {AnsweroptionsFreetextComponent} from './answeroptions-freetext/answeroptions-freetext.component';
import {AnsweroptionsRangedComponent} from './answeroptions-ranged/answeroptions-ranged.component';
import {LivePreviewModule} from '../../../live-preview/live-preview.module';

@NgModule({
            imports: [
              SharedModule,
              LivePreviewModule
            ],
            declarations: [
              AnsweroptionsComponent, AnsweroptionsDefaultComponent, AnsweroptionsFreetextComponent, AnsweroptionsRangedComponent
            ]
          })
export class AnsweroptionsModule {
}
