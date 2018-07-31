import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
import { FooterModule } from '../../footer/footer.module';
import { LivePreviewModule } from '../../live-preview/live-preview.module';
import { MarkdownModule } from '../../markdown/markdown.module';
import { SharedModule } from '../../shared/shared.module';
import { MemberGroupManagerComponent } from './member-group-manager/member-group-manager.component';
import { NicknameManagerComponent } from './nickname-manager/nickname-manager.component';
import { AnsweroptionsComponent } from './quiz-manager-details/answeroptions/answeroptions.component';
import { CountdownComponent } from './quiz-manager-details/countdown/countdown.component';
import { QuestiontextComponent } from './quiz-manager-details/questiontext/questiontext.component';
import { QuestiontypeComponent } from './quiz-manager-details/questiontype/questiontype.component';
import { QuizManagerDetailsOverviewComponent } from './quiz-manager-details/quiz-manager-details-overview/quiz-manager-details-overview.component';
import { QuizManagerDetailsModule } from './quiz-manager-details/quiz-manager-details.module';
import { QuizManagerComponent } from './quiz-manager/quiz-manager.component';
import { SoundManagerComponent } from './sound-manager/sound-manager.component';

const quizManagerRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'overview',
  }, {
    path: 'overview',
    component: QuizManagerComponent,
    data: {},
  }, {
    path: 'memberGroup',
    component: MemberGroupManagerComponent,
    data: {},
  }, {
    path: 'nicknames',
    component: NicknameManagerComponent,
    data: {},
  }, {
    path: 'sound',
    component: SoundManagerComponent,
    data: {},
  }, {
    path: ':questionIndex',
    children: [
      {
        path: 'overview',
        component: QuizManagerDetailsOverviewComponent,
        data: {},
      }, {
        path: 'questionText',
        component: QuestiontextComponent,
        data: {},
      }, {
        path: 'answeroptions',
        component: AnsweroptionsComponent,
        data: {},
      }, {
        path: 'countdown',
        component: CountdownComponent,
        data: {},
      }, {
        path: 'questionType',
        component: QuestiontypeComponent,
        data: {},
      },
    ],
  },
];

@NgModule({
  imports: [
    FooterModule, FormsModule, SharedModule, QuizManagerDetailsModule, MarkdownModule, LivePreviewModule, RouterModule.forChild(quizManagerRoutes),
  ],
  declarations: [
    QuizManagerComponent, NicknameManagerComponent, SoundManagerComponent, MemberGroupManagerComponent,
  ],
})
export class QuizManagerModule {
}
