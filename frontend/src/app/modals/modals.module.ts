import {NgModule} from '@angular/core';
import {AvailableQuizzesComponent} from './available-quizzes/available-quizzes.component';
import {SharedModule} from '../shared/shared.module';

export declare interface ModalI {
  dismiss(result?: any): void;

  abort(result?: any): void;

  next(result?: any): void;
}

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
