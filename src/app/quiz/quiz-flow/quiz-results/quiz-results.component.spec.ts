import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SurveyQuestion } from 'arsnova-click-v2-types/dist/questions/question_survey';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { Attendee } from '../../../../lib/attendee/attendee';
import { Language } from '../../../../lib/enums/enums';
import { createTranslateLoader } from '../../../../lib/translation.factory';
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
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../shared/shared.module';
import { ConfidenceRateComponent } from './confidence-rate/confidence-rate.component';
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
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        IndexedDbService, {
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
        ReadingConfirmationProgressComponent,
        QuizResultsComponent,
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
    expect(quizService.quiz[quizService.quiz.currentQuestionIndex] instanceof SurveyQuestion).toBeFalsy();
    expect(component.showLeaderBoardButton(quizService.quiz.currentQuestionIndex)).toBeTruthy();
  }));

  it(`#showStopQuizButton`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    quizService['_isOwner'] = true;
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

    expect(component.showStopQuizButton).toBeTruthy();
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
    expect(component.showStopCountdownButton).toBeTruthy();
  }));

  it(`#showStartQuizButton`, inject([QuizService, AttendeeService], (quizService: QuizService, attendeeService: AttendeeService) => {
    quizService['_isOwner'] = true;
    quizService.readingConfirmationRequested = true;

    expect(component.showStartQuizButton).toBeTruthy();
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
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    quizService.quiz.sessionConfig.confidenceSliderEnabled = true;

    expect(component.showConfidenceRate(component.selectedQuestionIndex)).toBeTruthy();
  }));

  it(`#modifyVisibleQuestion`, inject([QuestionTextService], async (questionTextService: QuestionTextService) => {
    spyOn(questionTextService, 'changeMultiple').and.callFake(() => new Promise<void>(resolve => resolve()));

    await component.modifyVisibleQuestion(component.selectedQuestionIndex);
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
          value: 0,
          confidence: 20,
          readingConfirmation: true,
          responseTime: 10,
        },
      ],
    }));
    quizService.quiz.sessionConfig.readingConfirmationEnabled = true;

    expect(component.showReadingConfirmation(component.selectedQuestionIndex)).toBeTruthy();
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
    if (i18nService.currentLanguage === Language.DE) {
      expect(result.percent).toEqual('100\xa0%'); // \xa0: Non breaking space
    } else {
      expect(result.percent).toEqual('100%');
    }
  }));
});
