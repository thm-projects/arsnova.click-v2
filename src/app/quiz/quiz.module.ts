import {NgModule} from '@angular/core';
import {QuizRenameComponent} from './quiz-rename/quiz-rename.component';
import {CasService} from '../service/cas.service';
import {QuizOverviewComponent} from './quiz-overview/quiz-overview.component';
import {SharedModule} from '../shared/shared.module';
import {QuizJoinComponent} from './quiz-join/quiz-join.component';

import {Routes, RouterModule} from '@angular/router';

const quizRoutes: Routes = [
  {
    path: 'overview',
    component: QuizOverviewComponent,
  },
  {
    path: 'rename',
    component: QuizRenameComponent
  },
  {
    path: ':quizName',
    component: QuizJoinComponent
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(quizRoutes)
  ],
  declarations: [
    QuizOverviewComponent,
    QuizRenameComponent,
    QuizJoinComponent
  ]
})
export class QuizModule {
}
