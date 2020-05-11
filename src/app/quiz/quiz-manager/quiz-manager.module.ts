import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MarkdownModule } from 'ngx-markdown';
import { LivePreviewModule } from '../../live-preview/live-preview.module';
import { MarkdownBarModule } from '../../markdown/markdown-bar.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SharedModule } from '../../shared/shared.module';
import { AnsweroptionsComponent } from './details/answeroptions/answeroptions.component';
import { CountdownComponent } from './details/countdown/countdown.component';
import { QuizManagerDetailsOverviewComponent } from './details/details-overview/quiz-manager-details-overview.component';
import { QuestiontextComponent } from './details/questiontext/questiontext.component';
import { QuestiontypeComponent } from './details/questiontype/questiontype.component';
import { QuizManagerDetailsModule } from './details/quiz-manager-details.module';
import { TagsComponent } from './details/tags/tags.component';
import { MemberGroupManagerComponent } from './member-group-manager/member-group-manager.component';
import { NicknameManagerComponent } from './nickname-manager/nickname-manager.component';
import { QuestionCardComponent } from './quiz-manager/question-card/question-card.component';
import { QuizManagerComponent } from './quiz-manager/quiz-manager.component';
import { QuizTypeSelectModalComponent } from './quiz-manager/quiz-type-select-modal/quiz-type-select-modal.component';
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
      }, {
        path: 'tags',
        component: TagsComponent,
        data: {},
      },
    ],
  },
];

@NgModule({
  imports: [
    FormsModule,
    SharedModule,
    QuizManagerDetailsModule,
    MarkdownBarModule,
    LivePreviewModule,
    RouterModule.forChild(quizManagerRoutes),
    PipesModule,
    MarkdownModule.forChild(),
    InfiniteScrollModule,
  ],
  declarations: [
    QuizManagerComponent,
    NicknameManagerComponent,
    SoundManagerComponent,
    MemberGroupManagerComponent,
    QuizTypeSelectModalComponent,
    QuestionCardComponent,
  ],
})
export class QuizManagerModule {
}
