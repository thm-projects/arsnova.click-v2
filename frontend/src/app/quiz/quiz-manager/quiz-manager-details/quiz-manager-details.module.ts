import {NgModule} from '@angular/core';
import {OverviewComponent} from './overview/overview.component';
import {CountdownComponent} from './countdown/countdown.component';
import {QuestiontextComponent} from './questiontext/questiontext.component';
import {QuestiontypeComponent} from './questiontype/questiontype.component';
import {SharedModule} from '../../../shared/shared.module';
import {MarkdownModule} from '../../../markdown/markdown.module';
import {LivePreviewModule} from '../../../live-preview/live-preview.module';
import {QuestionTextService} from '../../../service/question-text.service';
import {AnsweroptionsModule} from './answeroptions/answeroptions.module';

@NgModule({
  imports: [
    SharedModule,
    MarkdownModule,
    LivePreviewModule,
    AnsweroptionsModule
  ],
  providers: [QuestionTextService],
  declarations: [OverviewComponent, CountdownComponent, QuestiontextComponent, QuestiontypeComponent]
})
export class QuizManagerDetailsModule {
}
