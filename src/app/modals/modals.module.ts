import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddModeComponent } from './add-mode/add-mode.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AvailableQuizzesComponent } from './available-quizzes/available-quizzes.component';
import { QuizSaveComponent } from './quiz-save/quiz-save.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AvailableQuizzesComponent, AddModeComponent, AddUserComponent, QuizSaveComponent,
  ],
  entryComponents: [AvailableQuizzesComponent, AddModeComponent, AddUserComponent, QuizSaveComponent],
  exports: [AvailableQuizzesComponent, AddModeComponent, AddUserComponent, QuizSaveComponent],
})
export class ModalsModule {
}
