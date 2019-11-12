import { NgModule } from '@angular/core';
import { LivePreviewModule } from '../../../live-preview/live-preview.module';
import { MarkdownBarModule } from '../../../markdown/markdown-bar.module';
import { SharedModule } from '../../../shared/shared.module';
import { AnsweroptionsModule } from './answeroptions/answeroptions.module';
import { CountdownComponent } from './countdown/countdown.component';
import { QuizManagerDetailsOverviewComponent } from './details-overview/quiz-manager-details-overview.component';
import { QuestiontextComponent } from './questiontext/questiontext.component';
import { QuestiontypeComponent } from './questiontype/questiontype.component';

@NgModule({
  imports: [
    SharedModule, MarkdownBarModule, LivePreviewModule, AnsweroptionsModule,
  ],
  providers: [],
  declarations: [QuizManagerDetailsOverviewComponent, CountdownComponent, QuestiontextComponent, QuestiontypeComponent],
})
export class QuizManagerDetailsModule {
}
