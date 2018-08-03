import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/dist/answeroptions/answeroption_default';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/dist/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/dist/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/dist/session_configuration/session_config';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UserService } from '../../service/user/user.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { DB_TABLE } from '../../shared/enums';
import { SharedModule } from '../../shared/shared.module';

import { QuizOverviewComponent } from './quiz-overview.component';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

  const validQuiz = new DefaultQuestionGroup({
    hashtag: 'validtestquiz',
    sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
    questionList: [
      new SingleChoiceQuestion({
        questionText: 'testtext',
        timer: 20,
        displayAnswerText: true,
        showOneAnswerPerRow: false,
        answerOptionList: [
          new DefaultAnswerOption({
            answerText: 'answer1',
            isCorrect: true,
          }), new DefaultAnswerOption({
            answerText: 'answer2',
            isCorrect: false,
          }),
        ],
      }),
    ],
  });
  const invalidQuiz = new DefaultQuestionGroup({
    hashtag: 'invalidtestquiz',
    sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
    questionList: [
      new SingleChoiceQuestion({
        answerOptionList: [
          new DefaultAnswerOption({
            answerText: 'answer1',
            isCorrect: true,
          }), new DefaultAnswerOption({
            answerText: 'answer2',
            isCorrect: true,
          }),
        ],
      }),
    ],
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        UserService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: ActiveQuestionGroupService,
          useClass: ActiveQuestionGroupMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService,
      ],
      declarations: [QuizOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    TestBed.get(StorageService).create(DB_TABLE.QUIZ, 'validtestquiz', JSON.stringify(validQuiz.serialize())).subscribe();
    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    TestBed.get(StorageService).delete(DB_TABLE.QUIZ, 'validtestquiz').subscribe();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(QuizOverviewComponent.TYPE).toEqual('QuizOverviewComponent');
  }));

  describe('#startQuiz', () => {

    it('should start the quiz', inject([CurrentQuizService, Router], (currentQuizService: CurrentQuizService, router: Router) => {

      const quizName = 'validtestquiz';

      spyOn(currentQuizService, 'cacheQuiz').and.callThrough();
      spyOn(router, 'navigate').and.callFake(() => {});

      component.startQuiz(0).then(() => {
        expect(currentQuizService.quiz.serialize()).toEqual(jasmine.objectContaining(validQuiz.serialize()));
        expect(currentQuizService.cacheQuiz).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'flow']));
      });
    }));
  });

  describe('#editQuiz', () => {

    it('should redirect to the quiz manager',
      inject([ActiveQuestionGroupService, Router], (activeQuestionGroupService: ActiveQuestionGroupService, router: Router) => {
        spyOn(router, 'navigate').and.callFake(() => {});

        component.editQuiz(0);

        expect(activeQuestionGroupService.activeQuestionGroup.serialize()).toEqual(jasmine.objectContaining(validQuiz.serialize()));
        expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'manager']));

      }));
  });

  describe('#exportQuiz', () => {

    it('should generate an export file containing the quiz data', async () => {
      const exportData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(validQuiz.serialize()));

      await component.exportQuiz(0, (self, event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        expect(self.href).toEqual(exportData);
      });
    });
  });

  describe('#deleteQuiz', () => {

    it('should return null if the quiz does not exist', inject([StorageService], async (storageService: StorageService) => {
      const quizName = 'validtestquiz';

      await component.deleteQuiz(0);
      storageService.read(DB_TABLE.QUIZ, quizName).subscribe(quiz => {
        expect(quiz).toBe(null);
      });
    }));
  });

});
