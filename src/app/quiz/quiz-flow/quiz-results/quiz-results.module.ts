import { NgModule } from '@angular/core';
import { HeaderModule } from '../../../header/header.module';
import { SharedModule } from '../../../shared/shared.module';
import { QuizFlowSharedModule } from '../quiz-flow-shared.module';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
import { BonusTokenComponent } from './modals/bonus-token/bonus-token.component';
import { ToLobbyConfirmComponent } from './modals/to-lobby-confirm/to-lobby-confirm.component';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { QuestionDetailsComponent } from './question-details/question-details.component';
import { QuizResultsComponent } from './quiz-results.component';
import { ReadingConfirmationProgressComponent } from './reading-confirmation-progress/reading-confirmation-progress.component';

@NgModule({
  imports: [
    SharedModule, ProgressBarModule, HeaderModule, QuizFlowSharedModule,
  ],
  declarations: [
    QuizResultsComponent,
    ConfidenceRateComponent,
    ReadingConfirmationProgressComponent,
    QuestionDetailsComponent,
    ToLobbyConfirmComponent,
    BonusTokenComponent,
  ],
  bootstrap: [ToLobbyConfirmComponent],
  exports: [QuizResultsComponent],
})
export class QuizResultsModule {
}
