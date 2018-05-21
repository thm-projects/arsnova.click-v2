import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AvailableQuizzesComponent } from './available-quizzes/available-quizzes.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [AvailableQuizzesComponent],
  entryComponents: [AvailableQuizzesComponent],
  exports: [AvailableQuizzesComponent],
})
export class ModalsModule {
}
