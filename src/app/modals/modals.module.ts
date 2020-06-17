import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AddModeComponent } from './add-mode/add-mode.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AvailableQuizzesComponent } from './available-quizzes/available-quizzes.component';
import { HotkeyCheatsheetComponent } from './hotkey-cheatsheet/hotkey-cheatsheet.component';
import { OutdatedVersionComponent } from './outdated-version/outdated-version.component';
import { QuizSaveComponent } from './quiz-save/quiz-save.component';
import { ServerUnavailableModalComponent } from './server-unavailable-modal/server-unavailable-modal.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    AvailableQuizzesComponent,
    AddModeComponent,
    AddUserComponent,
    QuizSaveComponent,
    ServerUnavailableModalComponent,
    HotkeyCheatsheetComponent,
    OutdatedVersionComponent,
  ],
  exports: [
    AvailableQuizzesComponent, AddModeComponent, AddUserComponent, QuizSaveComponent, ServerUnavailableModalComponent,
    HotkeyCheatsheetComponent, OutdatedVersionComponent
  ],
  bootstrap: [OutdatedVersionComponent]
})
export class ModalsModule {
}
