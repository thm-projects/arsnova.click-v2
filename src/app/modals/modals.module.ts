import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddModeComponent } from './add-mode/add-mode.component';
import { AvailableQuizzesComponent } from './available-quizzes/available-quizzes.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [AvailableQuizzesComponent, AddModeComponent],
  entryComponents: [AvailableQuizzesComponent, AddModeComponent],
  exports: [AvailableQuizzesComponent, AddModeComponent],
})
export class ModalsModule {
}
