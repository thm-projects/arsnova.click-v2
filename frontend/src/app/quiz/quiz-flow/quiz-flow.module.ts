import {NgModule} from '@angular/core';
import {QuizLobbyComponent} from './quiz-lobby/quiz-lobby.component';
import {VotingComponent} from './voting/voting.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {QuizResultsComponent} from './quiz-results/quiz-results.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {QuizThemeComponent} from './quiz-theme/quiz-theme.component';
import {ThemesModule} from '../../themes/themes.module';
import {QuizResultsModule} from './quiz-results/quiz-results.module';
import {AttendeeService} from '../../service/attendee.service';
import {QuestionDetailsComponent} from './quiz-results/question-details/question-details.component';
import { ReadingConfirmationComponent } from './reading-confirmation/reading-confirmation.component';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';

const quizFlowRoutes: Routes = [
  {
    path: 'quiz/flow',
    redirectTo: 'quiz/flow/lobby',
    pathMatch: 'full'
  },
  {
    path: 'quiz/flow/lobby',
    component: QuizLobbyComponent,
    data: {}
  },
  {
    path: 'quiz/flow/results',
    component: QuizResultsComponent,
    data: {},
  },
  {
    path: 'quiz/flow/results/:questionIndex',
    component: QuestionDetailsComponent,
    data: {}
  },
  {
    path: 'quiz/flow/theme',
    component: QuizThemeComponent,
    data: {}
  },
  {
    path: 'quiz/flow/leaderboard/:questionIndex',
    component: LeaderboardComponent,
    data: {}
  },
  {
    path: 'quiz/flow/voting',
    component: VotingComponent,
    data: {}
  },
  {
    path: 'quiz/flow/reading-confirmation',
    component: ReadingConfirmationComponent,
    data: {}
  },
  {
    path: 'quiz/flow/confidence-rate',
    component: ConfidenceRateComponent,
    data: {}
  },
];

@NgModule({
  imports: [
    SharedModule,
    ThemesModule,
    RouterModule.forChild(quizFlowRoutes),
    QuizResultsModule,
    NgxQRCodeModule
  ],
  declarations: [
    QuizLobbyComponent,
    VotingComponent,
    LeaderboardComponent,
    QuizThemeComponent,
    ReadingConfirmationComponent,
    ConfidenceRateComponent
  ],
  providers: [
    AttendeeService
  ]
})
export class QuizFlowModule {
}
