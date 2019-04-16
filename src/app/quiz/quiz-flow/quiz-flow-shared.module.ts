import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { VotingQuestionComponent } from './voting/voting-question/voting-question.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [VotingQuestionComponent],
  exports: [VotingQuestionComponent],
})
export class QuizFlowSharedModule {
}
