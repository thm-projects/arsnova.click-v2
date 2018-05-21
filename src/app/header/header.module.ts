import { NgModule } from '@angular/core';
import { AvailableQuizzesComponent } from '../modals/available-quizzes/available-quizzes.component';
import { ModalsModule } from '../modals/modals.module';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    ModalsModule,
    SharedModule,
  ],
  exports: [
    HeaderComponent,
  ],
  declarations: [HeaderComponent],
  providers: [],
  bootstrap: [HeaderComponent],
  entryComponents: [AvailableQuizzesComponent],
})
export class HeaderModule {
}
