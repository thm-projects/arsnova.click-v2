import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddModeComponent } from './add-mode/add-mode.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AvailableQuizzesComponent } from './available-quizzes/available-quizzes.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [AvailableQuizzesComponent, AddModeComponent, AddUserComponent],
  entryComponents: [AvailableQuizzesComponent, AddModeComponent, AddUserComponent],
  exports: [AvailableQuizzesComponent, AddModeComponent, AddUserComponent],
})
export class ModalsModule {
}
