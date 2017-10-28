import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QuizRenameComponent} from './quiz-rename/quiz-rename.component';
import {CasService} from '../service/cas.service';
import {QuizOverviewComponent} from './quiz-overview/quiz-overview.component';
import {QuizFlowModule} from './quiz-flow/quiz-flow.module';
import {QuizManagerModule} from './quiz-manager/quiz-manager.module';
import {SharedModule} from '../shared/shared.module';

const quizRoutes: Routes = [
  {
    path: 'quiz/manager',
    loadChildren: 'app/quiz/quiz-manager/quiz-manager.module#QuizManagerModule'
  },
  {
    path: 'quiz/flow',
    canLoad: [CasService],
    loadChildren: 'app/quiz/quiz-flow/quiz-flow.module#QuizFlowModule'
  },
  {
    path: 'quiz/overview',
    component: QuizOverviewComponent,
  },
  {
    path: 'quiz/rename',
    component: QuizRenameComponent
  },
];

@NgModule({
  imports: [
    SharedModule,
    QuizManagerModule,
    QuizFlowModule,
    RouterModule.forChild(quizRoutes)
  ],
  declarations: [QuizOverviewComponent, QuizRenameComponent]
})
export class QuizModule {
}
