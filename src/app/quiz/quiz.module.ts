import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { QuizJoinComponent } from './quiz-join/quiz-join.component';
import { QuizOverviewComponent } from './quiz-overview/quiz-overview.component';
import { QuizPublicComponent } from './quiz-public/quiz-public.component';
import { QuizRenameComponent } from './quiz-rename/quiz-rename.component';

const quizRoutes: Routes = [
  {
    path: 'overview',
    component: QuizOverviewComponent,
  }, {
    path: 'rename',
    component: QuizRenameComponent,
  }, {
    path: 'create/:name',
    component: QuizRenameComponent,
  }, {
    path: 'public',
    component: QuizPublicComponent,
  }, {
    path: 'public/:own',
    component: QuizPublicComponent,
  }, {
    path: ':quizName',
    component: QuizJoinComponent,
  },
];

@NgModule({
  imports: [
    SharedModule, RouterModule.forChild(quizRoutes),
  ],
  declarations: [
    QuizOverviewComponent, QuizRenameComponent, QuizJoinComponent, QuizPublicComponent,
  ],
})
export class QuizModule {
}
