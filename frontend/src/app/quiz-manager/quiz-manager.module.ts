import {NgModule} from '@angular/core';
import {QuizManagerComponent} from './quiz-manager/quiz-manager.component';
import {SharedModule} from '../shared/shared.module';
import {QuizManagerDetailsModule} from './quiz-manager-details/quiz-manager-details.module';
import {RouterModule, Routes} from '@angular/router';
import {OverviewComponent} from './quiz-manager-details/overview/overview.component';
import {QuestiontextComponent} from './quiz-manager-details/questiontext/questiontext.component';
import {CountdownComponent} from './quiz-manager-details/countdown/countdown.component';
import {QuestiontypeComponent} from './quiz-manager-details/questiontype/questiontype.component';
import {MarkdownModule} from '../markdown/markdown.module';
import {LivePreviewModule} from '../live-preview/live-preview.module';
import {AnsweroptionsComponent} from 'app/quiz-manager/quiz-manager-details/answeroptions/answeroptions.component';
import {NicknameManagerComponent} from './nickname-manager/nickname-manager.component';
import {SoundManagerComponent} from './sound-manager/sound-manager.component';

const quizManagerRoutes: Routes = [
  {
    path: 'quiz-manager',
    component: QuizManagerComponent,
    data: {}
  },
  {
    path: 'quiz-manager/nicknames',
    component: NicknameManagerComponent,
    data: {}
  },
  {
    path: 'quiz-manager/sound',
    component: SoundManagerComponent,
    data: {}
  },
  {
    path: 'quiz-manager/:questionIndex/overview',
    component: OverviewComponent,
    data: {}
  },
  {
    path: 'quiz-manager/:questionIndex/questionText',
    component: QuestiontextComponent,
    data: {}
  },
  {
    path: 'quiz-manager/:questionIndex/answeroptions',
    component: AnsweroptionsComponent,
    data: {}
  },
  {
    path: 'quiz-manager/:questionIndex/countdown',
    component: CountdownComponent,
    data: {}
  },
  {
    path: 'quiz-manager/:questionIndex/questionType',
    component: QuestiontypeComponent,
    data: {}
  },
  /*
   { path: '',
   redirectTo: '/home',
   pathMatch: 'full'
   },
   */
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
            imports: [
              SharedModule,
              QuizManagerDetailsModule,
              MarkdownModule,
              LivePreviewModule,
              RouterModule.forChild(quizManagerRoutes),
            ],
            declarations: [QuizManagerComponent, NicknameManagerComponent, SoundManagerComponent]
          })
export class QuizManagerModule {
}
