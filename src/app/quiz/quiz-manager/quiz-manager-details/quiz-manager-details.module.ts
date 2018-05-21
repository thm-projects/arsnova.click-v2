import { NgModule } from '@angular/core';
import { LivePreviewModule } from '../../../live-preview/live-preview.module';
import { MarkdownModule } from '../../../markdown/markdown.module';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { SharedModule } from '../../../shared/shared.module';
import { AnsweroptionsModule } from './answeroptions/answeroptions.module';
import { CountdownComponent } from './countdown/countdown.component';
import { QuestiontextComponent } from './questiontext/questiontext.component';
import { QuestiontypeComponent } from './questiontype/questiontype.component';
import { QuizManagerDetailsOverviewComponent } from './quiz-manager-details-overview/quiz-manager-details-overview.component';

@NgModule({
  imports: [
    SharedModule,
    MarkdownModule,
    LivePreviewModule,
    AnsweroptionsModule,
  ],
  providers: [QuestionTextService],
  declarations: [QuizManagerDetailsOverviewComponent, CountdownComponent, QuestiontextComponent, QuestiontypeComponent],
})
export class QuizManagerDetailsModule {
}
