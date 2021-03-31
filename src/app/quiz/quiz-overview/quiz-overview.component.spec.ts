import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { QuizFilterPipeMock } from '../../../_mocks/_pipes/QuizFilterPipeMock';
import { DefaultSettings } from '../../lib/default.settings';
import { DefaultAnswerEntity } from '../../lib/entities/answer/DefaultAnswerEntity';
import { SingleChoiceQuestionEntity } from '../../lib/entities/question/SingleChoiceQuestionEntity';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../lib/entities/session-configuration/SessionConfigurationEntity';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../service/twitter/twitter.service.mock';
import { UserService } from '../../service/user/user.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { QuizOverviewComponent } from './quiz-overview.component';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

  const validQuiz = new QuizEntity({
    name: 'validtestquiz',
    sessionConfig: DefaultSettings.defaultQuizSettings.sessionConfig,
    questionList: [
      new SingleChoiceQuestionEntity({
        questionText: 'testtext',
        timer: 20,
        displayAnswerText: true,
        showOneAnswerPerRow: false,
        answerOptionList: [
          new DefaultAnswerEntity({
            answerText: 'answer1',
            isCorrect: true,
          }), new DefaultAnswerEntity({
            answerText: 'answer2',
            isCorrect: false,
          }),
        ],
      }),
    ],
  });
  const invalidQuiz = new QuizEntity({
    name: 'invalidtestquiz',
    sessionConfig: new SessionConfigurationEntity(DefaultSettings.defaultQuizSettings.sessionConfig),
    questionList: [
      new SingleChoiceQuestionEntity({
        answerOptionList: [
          new DefaultAnswerEntity({
            answerText: 'answer1',
            isCorrect: true,
          }), new DefaultAnswerEntity({
            answerText: 'answer2',
            isCorrect: true,
          }),
        ],
      }),
    ],
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), RouterTestingModule, HttpClientTestingModule, FontAwesomeModule,
      ],
      providers: [
        {
          provide: UserService,
          useValue: {
            isAuthorizedFor: () => true,
          },
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, RxStompService, SimpleMQ, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [QuizOverviewComponent, QuizFilterPipeMock],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', waitForAsync(() => {
    expect(QuizOverviewComponent.TYPE).toEqual('QuizOverviewComponent');
  }));

  describe('#startQuiz', () => {

    it('should start the quiz', inject([QuizService, Router], (quizService: QuizService, router: Router) => {

      const quizName = 'validtestquiz';

      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.startQuiz(validQuiz).then(() => {
        expect(quizService.quiz).toEqual(jasmine.objectContaining(validQuiz));
        expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'flow']));
      });
    }));
  });

  describe('#editQuiz', () => {

    it('should redirect to the quiz manager', inject([QuizService, Router], (quizService: QuizService, router: Router) => {
      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));
      component.sessions.splice(0, -1, validQuiz);

      component.editQuiz(validQuiz);

      expect(quizService.quiz).toEqual(jasmine.objectContaining(validQuiz));
      expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'manager', 'overview']));

    }));
  });

  describe('#exportQuiz', () => {

    it('should generate an export file containing the quiz data', async () => {
      component.sessions.push(validQuiz);
      const exportData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(validQuiz));

      await component.exportQuiz(validQuiz, (self, event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        expect(self.href).toEqual(exportData);
      });
    });
  });

  describe('#deleteQuiz', () => {

    it('should return null if the quiz does not exist', inject([StorageService], (storageService: StorageService) => {
      const quizName = 'validtestquiz';

      component.deleteQuiz(validQuiz);
      storageService.db.Quiz.get(quizName).then(quiz => {
        expect(quiz).toBe(undefined);
      });
    }));
  });

});
