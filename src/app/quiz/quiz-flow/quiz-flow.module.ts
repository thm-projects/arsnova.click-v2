import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QRCodeModule } from 'angular2-qrcode';
import { MarkdownModule } from 'ngx-markdown';
import { CasLoginService } from '../../service/login/cas-login.service';
import { ShowUnloadWarningGuard } from '../../service/show-unload-warning-guard/show-unload-warning.guard';
import { SharedModule } from '../../shared/shared.module';
import { AnswerResultComponent } from './answer-result/answer-result.component';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { QuizFlowSharedModule } from './quiz-flow-shared.module';
import { EditModeConfirmComponent } from './quiz-lobby/modals/edit-mode-confirm/edit-mode-confirm.component';
import { QrCodeContentComponent } from './quiz-lobby/modals/qr-code-content/qr-code-content.component';
import { QuizLobbyComponent } from './quiz-lobby/quiz-lobby.component';
import { QuestionDetailsComponent } from './quiz-results/question-details/question-details.component';
import { QuizResultsComponent } from './quiz-results/quiz-results.component';
import { QuizResultsModule } from './quiz-results/quiz-results.module';
import { ReadingConfirmationComponent } from './reading-confirmation/reading-confirmation.component';
import { VotingComponent } from './voting/voting.component';

export const quizFlowRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lobby',
  }, {
    path: 'lobby',
    canLoad: [CasLoginService],
    component: QuizLobbyComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'results',
    component: QuizResultsComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'results/:questionIndex',
    component: QuestionDetailsComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'leaderboard',
    component: LeaderboardComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'leaderboard/:questionIndex',
    component: LeaderboardComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'voting',
    component: VotingComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'reading-confirmation',
    component: ReadingConfirmationComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'confidence-rate',
    component: ConfidenceRateComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  }, {
    path: 'answer-result',
    component: AnswerResultComponent,
    data: {},
    canDeactivate: [ShowUnloadWarningGuard],
  },
];

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(quizFlowRoutes), QuizResultsModule, QRCodeModule, QuizFlowSharedModule, MarkdownModule.forChild(),
  ],
  bootstrap: [EditModeConfirmComponent, QrCodeContentComponent],
  declarations: [
    AnswerResultComponent,
    QuizLobbyComponent,
    VotingComponent,
    LeaderboardComponent,
    ReadingConfirmationComponent,
    ConfidenceRateComponent,
    EditModeConfirmComponent,
    QrCodeContentComponent,
  ],
})
export class QuizFlowModule {
}
