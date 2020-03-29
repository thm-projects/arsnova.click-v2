import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';
import { AdminOverviewComponent } from './admin-overview/admin-overview.component';
import { QuizAdminComponent } from './quiz-admin/quiz-admin.component';
import { QuizDetailsAdminComponent } from './quiz-details-admin/quiz-details-admin.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { QuizPoolAdminComponent } from './quiz-pool-admin/quiz-pool-admin.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserAdminComponent,
  }, {
    path: 'quiz',
    component: QuizAdminComponent,
  }, {
    path: 'quiz/pool',
    component: QuizPoolAdminComponent,
  }, {
    path: 'quiz/:id',
    component: QuizDetailsAdminComponent,
  }, {
    path: '',
    component: AdminOverviewComponent,
  },
];

@NgModule({
  declarations: [UserAdminComponent, QuizAdminComponent, AdminOverviewComponent, QuizDetailsAdminComponent, QuizPoolAdminComponent],
  imports: [
    SharedModule, RouterModule.forChild(routes), PipesModule,
  ],
})
export class AdminModule {
}
