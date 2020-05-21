import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { QuestionType } from '../../../../lib/enums/QuestionType';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../service/themes/themes.service';
import { TwitterService } from '../../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { QuestiontypeComponent } from './questiontype.component';

describe('QuestiontypeComponent', () => {
  let component: QuestiontypeComponent;
  let quizService: QuizService;
  let fixture: ComponentFixture<QuestiontypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
            queryParamMap: of({
              get: () => 0,
            }),
          },
        }, SharedService, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        },
      ],
      declarations: [QuestiontypeComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    quizService = TestBed.inject(QuizService);
    fixture = TestBed.createComponent(QuestiontypeComponent);
    component = fixture.componentInstance;
    component['_questionType'] = QuestionType.SingleChoiceQuestion;
    component['_questionIndex'] = 0;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(QuestiontypeComponent.TYPE).toEqual('QuestiontypeComponent');
  }));

  it('should return true if the current question type matches the input', () => {
    expect(component.isActiveQuestionType(QuestionType.SingleChoiceQuestion)).toBeTruthy();
  });

  it('should return false if the current question type does not match the input', () => {
    expect(component.isActiveQuestionType('SurveyQuestion')).toBeFalsy();
  });

  it('should convert the current question type to a new one', () => {
    const targetType = QuestionType.MultipleChoiceQuestion;
    component.morphToQuestionType(QuestionType.MultipleChoiceQuestion);
    expect(quizService.quiz.questionList[0].TYPE).toEqual(targetType);
  });

  it('should not convert the current question type if the passed type does not exist', () => {
    const targetType = 'NotExistingType';
    const initType = quizService.quiz.questionList[0].TYPE;
    component.morphToQuestionType(QuestionType.MultipleChoiceQuestion);
    expect(quizService.quiz.questionList[0].TYPE).not.toEqual(targetType);
    expect(quizService.quiz.questionList[0].TYPE).not.toEqual(initType);
    expect(quizService.quiz.questionList[0].TYPE).toEqual(QuestionType.MultipleChoiceQuestion);
  });
});
