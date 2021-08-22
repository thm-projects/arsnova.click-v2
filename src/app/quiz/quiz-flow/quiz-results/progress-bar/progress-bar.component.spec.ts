import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Attendee } from '../../../../lib/attendee/attendee';
import { FreeTextQuestionEntity } from '../../../../lib/entities/question/FreeTextQuestionEntity';
import { RangedQuestionEntity } from '../../../../lib/entities/question/RangedQuestionEntity';
import { SingleChoiceQuestionEntity } from '../../../../lib/entities/question/SingleChoiceQuestionEntity';
import { AttendeeMockService } from '../../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { SharedModule } from '../../../../shared/shared.module';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { ProgressBarAnonymousComponent } from './progress-bar-anonymous/progress-bar-anonymous.component';
import { ProgressBarFreetextComponent } from './progress-bar-freetext/progress-bar-freetext.component';
import { ProgressBarMultipleChoiceComponent } from './progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import { ProgressBarRangedComponent } from './progress-bar-ranged/progress-bar-ranged.component';
import { ProgressBarSingleChoiceComponent } from './progress-bar-single-choice/progress-bar-single-choice.component';
import { ProgressBarSurveyComponent } from './progress-bar-survey/progress-bar-survey.component';

import { ProgressBarComponent } from './progress-bar.component';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbActiveModal, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, I18nService, HeaderLabelService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, QuestionTextService,
      ],
      declarations: [
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ProgressBarComponent,
        ProgressBarAnonymousComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));

  it('should contain a TYPE reference', (
    () => {
      expect(ProgressBarComponent.TYPE).toEqual('ProgressBarComponent');
    }
  ));

  it('#attendeeDataForAnswer', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 0;
    component.hideProgressbarCssStyle = false;
    const question = <SingleChoiceQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));

  it('#attendeeDataForAnswer anonymous', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 0;
    const question = <SingleChoiceQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));

  it('#attendeeDataForAnswer - RangedQuestion', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 2;
    component.hideProgressbarCssStyle = false;
    const question = <RangedQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));

  it('#attendeeDataForAnswer - RangedQuestion anonymous', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 2;
    const question = <RangedQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));

  it('#attendeeDataForAnswer - FreeTextQuestion', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 1;
    component.hideProgressbarCssStyle = false;
    const question = <FreeTextQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));

  it('#attendeeDataForAnswer - FreeTextQuestion anonymous', waitForAsync(() => {
    const quizService: QuizService = TestBed.inject(QuizService);
    const attendeeService: AttendeeService = TestBed.inject(AttendeeService);
    const questionTextService: QuestionTextService = TestBed.inject(QuestionTextService);

    component.questionIndex = 1;
    const question = <FreeTextQuestionEntity>quizService.quiz.questionList[component.questionIndex];
    question.addDefaultAnswerOption();

    attendeeService.addMember(new Attendee({
      id: '',
      name: 'testNickname',
      groupName: 'Default',
      currentQuizName: '',
      colorCode: '#00000',
      responses: [],
    }));

    questionTextService.changeMultiple(question.answerOptionList.map(answer => answer.answerText)).subscribe();
    questionTextService.eventEmitter.subscribe((value) => {
      if (Array.isArray(value)) {
        component.data = value;
        expect(component.attendeeDataForAnswer(0)).toBeTruthy();
      }
    });
  }));
});
