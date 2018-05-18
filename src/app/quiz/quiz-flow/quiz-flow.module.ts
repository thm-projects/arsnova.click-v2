import {NgModule} from '@angular/core';
import {QuizLobbyComponent} from './quiz-lobby/quiz-lobby.component';
import {VotingComponent} from './voting/voting.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {QuizResultsComponent} from './quiz-results/quiz-results.component';
import {SharedModule} from '../../shared/shared.module';
import {QuizThemeComponent} from './quiz-theme/quiz-theme.component';
import {ThemesModule} from '../../themes/themes.module';
import {QuizResultsModule} from './quiz-results/quiz-results.module';
import {AttendeeService} from '../../service/attendee.service';
import {QuestionDetailsComponent} from './quiz-results/question-details/question-details.component';
import {ReadingConfirmationComponent} from './reading-confirmation/reading-confirmation.component';
import {ConfidenceRateComponent} from './confidence-rate/confidence-rate.component';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';

import {Routes, RouterModule} from '@angular/router';
import {CasService} from '../../service/cas.service';
import {HeaderLabelService} from '../../service/header-label.service';

export const quizFlowRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lobby',
  },
  {
    path: 'lobby',
    canLoad: [CasService],
    component: QuizLobbyComponent,
    data: {}
  },
  {
    path: 'results',
    component: QuizResultsComponent,
    data: {},
  },
  {
    path: 'results/:questionIndex',
    component: QuestionDetailsComponent,
    data: {}
  },
  {
    path: 'theme',
    component: QuizThemeComponent,
    data: {}
  },
  {
    path: 'leaderboard',
    component: LeaderboardComponent,
    data: {}
  },
  {
    path: 'leaderboard/:questionIndex',
    component: LeaderboardComponent,
    data: {}
  },
  {
    path: 'voting',
    component: VotingComponent,
    data: {}
  },
  {
    path: 'reading-confirmation',
    component: ReadingConfirmationComponent,
    data: {}
  },
  {
    path: 'confidence-rate',
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
  ]
})
export class QuizFlowModule {
}
