import { NgModule } from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {ProgressBarSingleChoiceComponent} from './progress-bar-single-choice/progress-bar-single-choice.component';
import {ProgressBarMultipleChoiceComponent} from './progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import {ProgressBarSurveyComponent} from './progress-bar-survey/progress-bar-survey.component';
import {ProgressBarRangedComponent} from './progress-bar-ranged/progress-bar-ranged.component';
import {ProgressBarFreetextComponent} from './progress-bar-freetext/progress-bar-freetext.component';
import { ProgressBarComponent } from './progress-bar.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProgressBarSingleChoiceComponent,
    ProgressBarMultipleChoiceComponent,
    ProgressBarSurveyComponent,
    ProgressBarRangedComponent,
    ProgressBarFreetextComponent,
    ProgressBarComponent
  ],
  exports: [
    ProgressBarComponent
  ]
})
export class ProgressBarModule { }
