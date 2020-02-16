import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { TranslateServiceMock } from '../../../../_mocks/_services/TranslateServiceMock';
import { Attendee } from '../../../lib/attendee/attendee';
import { SurveyQuestionEntity } from '../../../lib/entities/question/SurveyQuestionEntity';
import { Language } from '../../../lib/enums/enums';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';
import { VotingQuestionComponent } from '../voting/voting-question/voting-question.component';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
import { ProgressBarAnonymousComponent } from './progress-bar/progress-bar-anonymous/progress-bar-anonymous.component';
import { ProgressBarFreetextComponent } from './progress-bar/progress-bar-freetext/progress-bar-freetext.component';
import { ProgressBarMultipleChoiceComponent } from './progress-bar/progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import { ProgressBarRangedComponent } from './progress-bar/progress-bar-ranged/progress-bar-ranged.component';
import { ProgressBarSingleChoiceComponent } from './progress-bar/progress-bar-single-choice/progress-bar-single-choice.component';
import { ProgressBarSurveyComponent } from './progress-bar/progress-bar-survey/progress-bar-survey.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

import { QuizResultsComponent } from './quiz-results.component';
import { ReadingConfirmationProgressComponent } from './reading-confirmation-progress/reading-confirmation-progress.component';

describe('QuizResultsComponent', () => {
  let component: QuizResultsComponent;
  let fixture: ComponentFixture<QuizResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }), HttpClientTestingModule,
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, TranslateService, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, SharedService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, HeaderLabelService, I18nService, QuestionTextService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, SimpleMQ,
      ],
      declarations: [
        ConfidenceRateComponent,
        ProgressBarComponent,
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ReadingConfirmationProgressComponent,
        QuizResultsComponent,
        ProgressBarAnonymousComponent,
        VotingQuestionComponent,
        ServerUnavailableModalComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(inject([QuizService], (quizService: QuizService) => {
    fixture = TestBed.createComponent(QuizResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    quizService.quiz.currentQuestionIndex = 0;
  })));

  it(`should be created`, () => {
    expect(component).toBeTruthy();
  });

  it(`should container a TYPE reference`, () => {
    expect(QuizResultsComponent.TYPE).toEqual('QuizResultsComponent');
  });

  it(`#showLeaderBoardButton`, inject([QuizService], (quizService: QuizService) => {
    expect(quizService.quiz.questionList[quizService.quiz.currentQuestionIndex] instanceof SurveyQuestionEntity).toBeFalsy();
    expect(component.showLeaderBoardButton(quizService.quiz.currentQuestionIndex)).toBeTruthy();
  }));

  it(`#showStopQuizButton`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    quizService.isOwner = true;
    quizService.currentQuestion().timer = 0;
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [],
      currentQuizName: '',
      ticket: '',
    }));

    expect(component.showStopQuizButton).toBeFalsy();
  }));

  it(`#showStopCountdownButton`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    quizService.currentQuestion().timer = 10;
    quizService['_isOwner'] = true;
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [],
      currentQuizName: '',
      ticket: '',
    }));
    component.countdown = quizService.currentQuestion().timer;

    expect(component.countdown).toBeTruthy();
    expect(component.showStopCountdownButton).toBeFalsy();
  }));

  it(`#showStartQuizButton`, inject([QuizService], (quizService: QuizService) => {
    quizService['_isOwner'] = true;
    quizService.readingConfirmationRequested = true;

    expect(component.showStartQuizButton).toBeFalsy();
  }));

  it(`#hideProgressbarCssStyle`, inject([QuizService], (quizService: QuizService) => {
    quizService.readingConfirmationRequested = false;
    quizService.quiz.currentQuestionIndex = 0;
    expect(component.hideProgressbarStyle).toBeTruthy();
  }));

  it(`#showConfidenceRate`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      currentQuizName: '',
      responses: [
        {
          value: '0',
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    quizService.quiz.sessionConfig.confidenceSliderEnabled = true;

    expect(component.showConfidenceRate(0)).toBeFalsy();
  }));

  it(`#modifyVisibleQuestion`, inject([QuestionTextService], async (questionTextService: QuestionTextService) => {
    spyOn(questionTextService, 'changeMultiple').and.callFake(() => new Promise<void>(resolve => resolve()));

    await component.modifyVisibleQuestion(0);
    expect(questionTextService.changeMultiple).toHaveBeenCalled();
  }));

  it(`#getConfidenceData`, inject([AttendeeService, I18nService], (attendeeService: AttendeeService, i18nService: I18nService) => {
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      currentQuizName: '',
      responses: [
        {
          value: '0',
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));

    const result = component.getConfidenceData(0);
    expect(result.base).toEqual(1);
    expect(result.absolute).toEqual(1);
    if (i18nService.currentLanguage === Language.DE) {
      expect(result.percent).toEqual('20\xa0%');
    } else {
      expect(result.percent).toEqual('20%');
    }
  }));

  it(`#showReadingConfirmation`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      currentQuizName: '',
      responses: [
        {
          value: '0',
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    quizService.quiz.sessionConfig.readingConfirmationEnabled = true;

    expect(component.showReadingConfirmation(0)).toBeFalsy();
  }));

  it(`#showResponseProgress`, inject([QuizService], (quizService: QuizService) => {

    expect(component.showResponseProgress()).toEqual(quizService.quiz.sessionConfig.showResponseProgress);
  }));

  it(`#getReadingConfirmationData`, inject([AttendeeService, I18nService], (attendeeService: AttendeeService, i18nService: I18nService) => {
    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      currentQuizName: '',
      responses: [
        {
          value: '0',
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));

    const result = component.getReadingConfirmationData(0);
    expect(result.base).toEqual(1);
    expect(result.absolute).toEqual(1);
    if (i18nService.currentLanguage === Language.DE) {
      expect(result.percent).toEqual('100\xa0%'); // \xa0: Non breaking space
    } else {
      expect(result.percent).toEqual('100%');
    }
  }));
});
