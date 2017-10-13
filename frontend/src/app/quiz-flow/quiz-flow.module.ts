import {NgModule} from '@angular/core';
import {QuizLobbyComponent} from './quiz-lobby/quiz-lobby.component';
import {VotingComponent} from './voting/voting.component';
import {LeaderboardComponent} from './leaderboard/leaderboard.component';
import {QuizResultsComponent} from './quiz-results/quiz-results.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {QuizThemeComponent} from './quiz-theme/quiz-theme.component';
import {ThemesModule} from '../themes/themes.module';
import {QuizResultsModule} from './quiz-results/quiz-results.module';
import {AttendeeService} from '../service/attendee.service';
import {QuestionDetailsComponent} from './quiz-results/question-details/question-details.component';

const quizFlowRoutes: Routes = [
  {
    path: 'quiz-lobby',
    component: QuizLobbyComponent,
    data: {}
  },
  {
    path: 'quiz-results',
    component: QuizResultsComponent,
    data: {}
  },
  {
    path: 'quiz-results/:questionIndex',
    component: QuestionDetailsComponent,
    data: {}
  },
  {
    path: 'quiz-theme',
    component: QuizThemeComponent,
    data: {}
  },
  {
    path: 'leaderboard/:questionIndex',
    component: LeaderboardComponent,
    data: {}
  },
  {
    path: 'voting/:questionIndex',
    component: VotingComponent,
    data: {}
  },
  /*
   { path: '',
   redirectTo: '/home',
   pathMatch: 'full'
   },
   */
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    SharedModule,
    ThemesModule,
    RouterModule.forChild(quizFlowRoutes),
    QuizResultsModule
  ],
  declarations: [QuizLobbyComponent, VotingComponent, LeaderboardComponent, QuizThemeComponent],
  providers: [AttendeeService]
})
export class QuizFlowModule {
}
