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
import { SessionConfiguration } from 'arsnova-click-v2-types/dist/session_configuration/session_config';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { DbTable } from '../../../lib/enums/enums';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
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
import { SharedModule } from '../../shared/shared.module';

import { QuizOverviewComponent } from './quiz-overview.component';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

  const validQuiz = new QuizEntity({
    name: 'validtestquiz',
    sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings.sessionConfig),
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
  const invalidQuiz = new QuizEntity({
    name: 'invalidtestquiz',
    sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings.sessionConfig),
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
        UserService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, {
          provide: QuizService,
          useClass: QuizMockService,
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
    TestBed.get(StorageService).create(DbTable.Quiz, 'validtestquiz', JSON.stringify(validQuiz)).subscribe();
    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    TestBed.get(StorageService).delete(DbTable.Quiz, 'validtestquiz').subscribe();
  });

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(QuizOverviewComponent.TYPE).toEqual('QuizOverviewComponent');
  }));

  describe('#startQuiz', () => {

    it('should start the quiz', inject([QuizService, Router], (quizService: QuizService, router: Router) => {

      const quizName = 'validtestquiz';

      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.startQuiz(0).then(() => {
        expect(quizService.quiz).toEqual(jasmine.objectContaining(validQuiz));
        expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'flow']));
      });
    }));
  });

  describe('#editQuiz', () => {

    it('should redirect to the quiz manager', inject([QuizService, Router], (quizService: QuizService, router: Router) => {
      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.editQuiz(0);

      expect(quizService.quiz).toEqual(jasmine.objectContaining(validQuiz));
      expect(router.navigate).toHaveBeenCalledWith(jasmine.arrayWithExactContents(['/quiz', 'manager']));

    }));
  });

  describe('#exportQuiz', () => {

    it('should generate an export file containing the quiz data', async () => {
      const exportData = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(validQuiz));

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
      storageService.read(DbTable.Quiz, quizName).subscribe(quiz => {
        expect(quiz).toBe(null);
      });
    }));
  });

});
