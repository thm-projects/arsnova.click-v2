import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IQuestionChoice } from 'arsnova-click-v2-types/src/questions/interfaces';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { AttendeeMockService } from '../../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';
import { ProgressBarFreetextComponent } from './progress-bar-freetext/progress-bar-freetext.component';
import { ProgressBarMultipleChoiceComponent } from './progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import { ProgressBarRangedComponent } from './progress-bar-ranged/progress-bar-ranged.component';
import { ProgressBarSingleChoiceComponent } from './progress-bar-single-choice/progress-bar-single-choice.component';
import { ProgressBarSurveyComponent } from './progress-bar-survey/progress-bar-survey.component';

import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        NgbActiveModal,
        { provide: TrackingService, useClass: TrackingMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        I18nService,
        HeaderLabelService,
        { provide: AttendeeService, useClass: AttendeeMockService },
        QuestionTextService,
      ],
      declarations: [
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ProgressBarComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', (() => {
    expect(ProgressBarComponent.TYPE).toEqual('ProgressBarComponent');
  }));

  it('#attendeeDataForAnswer', async(inject(
    [CurrentQuizService, AttendeeService, QuestionTextService],
    async (currentQuizService: CurrentQuizService, attendeeService: AttendeeService, questionTextService: QuestionTextService) => {
      component.questionIndex = 0;
      const question = <IQuestionChoice>currentQuizService.quiz.questionList[component.questionIndex];
      await questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText));
      questionTextService.eventEmitter.subscribe((value) => {
        if (value instanceof Array) {
          component.data = value;
          expect(component.attendeeDataForAnswer(0)).toBeTruthy();
        }
      });
    }),
  ));
});
