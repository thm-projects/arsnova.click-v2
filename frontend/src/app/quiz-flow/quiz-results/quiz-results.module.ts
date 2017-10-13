import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {QuizResultsComponent} from './quiz-results.component';
import {ConfidenceRateComponent} from './confidence-rate/confidence-rate.component';
import {ReadingConfirmationComponent} from './reading-confirmation/reading-confirmation.component';
import {ProgressBarModule} from './progress-bar/progress-bar.module';
import {QuestionDetailsComponent} from './question-details/question-details.component';
import {LivePreviewModule} from '../../live-preview/live-preview.module';

@NgModule({
            imports: [
              SharedModule,
              ProgressBarModule,
              LivePreviewModule
            ],
            declarations: [QuizResultsComponent, ConfidenceRateComponent, ReadingConfirmationComponent, QuestionDetailsComponent],
            exports: [QuizResultsComponent],
          })
export class QuizResultsModule {
}
