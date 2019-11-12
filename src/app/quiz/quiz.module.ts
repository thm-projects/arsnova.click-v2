import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { UserRoleGuardService } from '../service/user-role-guard/user-role-guard.service';
import { SharedModule } from '../shared/shared.module';
import { QuizDuplicateComponent } from './quiz-duplicate/quiz-duplicate.component';
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
    component: QuizDuplicateComponent,
    canActivate: [UserRoleGuardService],
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
  providers: [],
  declarations: [
    QuizOverviewComponent, QuizRenameComponent, QuizJoinComponent, QuizPublicComponent, QuizDuplicateComponent,
  ],
})
export class QuizModule {
}
