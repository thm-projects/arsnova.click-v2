import {NgModule} from '@angular/core';
import {AvailableQuizzesComponent} from './available-quizzes/available-quizzes.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [AvailableQuizzesComponent],
  entryComponents: [AvailableQuizzesComponent],
  exports: [AvailableQuizzesComponent]
})
export class ModalsModule {
}
