import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SurveyQuestion } from 'arsnova-click-v2-types/src/questions/question_survey';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { Attendee } from '../../../../lib/attendee/attendee';
import { Countdown } from '../../../../lib/countdown/countdown';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../service/question-text/question-text.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { LANGUAGE } from '../../../shared/enums';
import { SharedModule } from '../../../shared/shared.module';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
import { ProgressBarFreetextComponent } from './progress-bar/progress-bar-freetext/progress-bar-freetext.component';
import { ProgressBarMultipleChoiceComponent } from './progress-bar/progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import { ProgressBarRangedComponent } from './progress-bar/progress-bar-ranged/progress-bar-ranged.component';
import { ProgressBarSingleChoiceComponent } from './progress-bar/progress-bar-single-choice/progress-bar-single-choice.component';
import { ProgressBarSurveyComponent } from './progress-bar/progress-bar-survey/progress-bar-survey.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';

import { QuizResultsComponent } from './quiz-results.component';
import { ReadingConfirmationComponent } from './reading-confirmation/reading-confirmation.component';

describe('QuizResultsComponent', () => {
  let component: QuizResultsComponent;
  let fixture: ComponentFixture<QuizResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, TranslateService, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, HeaderLabelService, I18nService, QuestionTextService,
      ],
      declarations: [
        ConfidenceRateComponent,
        ProgressBarComponent,
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ReadingConfirmationComponent,
        QuizResultsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(inject([CurrentQuizService], (currentQuizService: CurrentQuizService) => {
    fixture = TestBed.createComponent(QuizResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    currentQuizService.questionIndex = 0;
  })));

  it(`should be created`, () => {
    expect(component).toBeTruthy();
  });

  it(`should container a TYPE reference`, () => {
    expect(QuizResultsComponent.TYPE).toEqual('QuizResultsComponent');
  });

  it(`#showLeaderBoardButton`, inject([CurrentQuizService], (currentQuizService: CurrentQuizService) => {
    expect(currentQuizService.quiz[currentQuizService.questionIndex] instanceof SurveyQuestion).toBeFalsy();
    expect(component.showLeaderBoardButton(currentQuizService.questionIndex)).toBeTruthy();
  }));

  it(`#showStopQuizButton`, inject([CurrentQuizService, AttendeeService], (currentQuizService: CurrentQuizService, attendeeService: AttendeeService) => {
    currentQuizService['_isOwner'] = true;
    currentQuizService.currentQuestion().timer = 0;
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [],
    }));

    expect(component.showStopQuizButton()).toBeTruthy();
  }));

  it(`#showStopCountdownButton`, inject([CurrentQuizService, AttendeeService], (currentQuizService: CurrentQuizService, attendeeService: AttendeeService) => {
    currentQuizService.currentQuestion().timer = 10;
    currentQuizService['_isOwner'] = true;
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [],
    }));
    component.countdown = new Countdown(currentQuizService.currentQuestion(), new Date().getTime());

    expect(component.countdown.isRunning).toBeTruthy();
    expect(component.showStopCountdownButton()).toBeTruthy();
  }));

  it(`#showStartQuizButton`, inject([CurrentQuizService, AttendeeService], (currentQuizService: CurrentQuizService, attendeeService: AttendeeService) => {
    currentQuizService['_isOwner'] = true;
    currentQuizService.readingConfirmationRequested = true;

    expect(component.showStartQuizButton()).toBeTruthy();
  }));

  it(`#hideProgressbarCssStyle`, inject([CurrentQuizService], (currentQuizService: CurrentQuizService) => {
    currentQuizService.readingConfirmationRequested = false;
    currentQuizService.questionIndex = 0;
    expect(component.hideProgressbarCssStyle()).toBeTruthy();
  }));

  it(`#showConfidenceRate`, inject([CurrentQuizService, AttendeeService], (currentQuizService: CurrentQuizService, attendeeService: AttendeeService) => {
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [
        {
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    currentQuizService.quiz.sessionConfig.confidenceSliderEnabled = true;

    expect(component.showConfidenceRate(component.selectedQuestionIndex)).toBeTruthy();
  }));

  it(`#modifyVisibleQuestion`, inject([QuestionTextService], async (questionTextService: QuestionTextService) => {
    spyOn(questionTextService, 'changeMultiple').and.callFake(() => {});

    await component.modifyVisibleQuestion(component.selectedQuestionIndex);
    expect(questionTextService.changeMultiple).toHaveBeenCalled();
  }));

  it(`#getConfidenceData`, inject([AttendeeService, I18nService], (attendeeService: AttendeeService, i18nService: I18nService) => {
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [
        {
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));

    const result = component.getConfidenceData(component.selectedQuestionIndex);
    expect(result.base).toEqual(1);
    expect(result.absolute).toEqual(1);
    switch (i18nService.currentLanguage) {
      case LANGUAGE.DE:
        expect(result.percent).toEqual('20\xa0%'); // \xa0: Non breaking space
        break;
      default:
        expect(result.percent).toEqual('20%');
    }
  }));

  it(`#showReadingConfirmation`, inject([CurrentQuizService, AttendeeService], (currentQuizService: CurrentQuizService, attendeeService: AttendeeService) => {
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [
        {
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    currentQuizService.quiz.sessionConfig.readingConfirmationEnabled = true;

    expect(component.showReadingConfirmation(component.selectedQuestionIndex)).toBeTruthy();
  }));

  it(`#showResponseProgress`, inject([CurrentQuizService], (currentQuizService: CurrentQuizService) => {

    expect(component.showResponseProgress()).toEqual(currentQuizService.quiz.sessionConfig.showResponseProgress);
  }));

  it(`#getReadingConfirmationData`, inject([AttendeeService, I18nService], (attendeeService: AttendeeService, i18nService: I18nService) => {
    attendeeService.addMember(new Attendee({
      id: 0,
      name: 'testNickname',
      groupName: 'Default',
      colorCode: '#00000',
      responses: [
        {
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));

    const result = component.getReadingConfirmationData(component.selectedQuestionIndex);
    expect(result.base).toEqual(1);
    expect(result.absolute).toEqual(1);
    switch (i18nService.currentLanguage) {
      case LANGUAGE.DE:
        expect(result.percent).toEqual('100\xa0%'); // \xa0: Non breaking space
        break;
      default:
        expect(result.percent).toEqual('100%');
    }
  }));
});
