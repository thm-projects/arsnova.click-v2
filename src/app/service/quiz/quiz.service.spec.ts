import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { of } from 'rxjs';
import { QuizMock } from '../../../_mocks/_fixtures/quiz.mock';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { StatusProtocol } from '../../lib/enums/Message';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  let quizMock: QuizEntity;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, FooterBarService, QuizService,
      ],
    });
  }));

  beforeEach(() => {
    sessionStorage.clear();
    quizMock = new QuizEntity(JSON.parse(JSON.stringify(QuizMock)));
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    const service: QuizService = TestBed.inject(QuizService);
    expect(service).toBeTruthy();
  });

  it('should persist the current state', () => {
    const service: QuizService = TestBed.inject(QuizService);
    const quizApiService: QuizApiService = TestBed.inject(QuizApiService);

    spyOn(quizApiService, 'putSavedQuiz').and.callFake(() => of(null));

    service['_isInEditMode'] = true;
    service.persist();

    expect(quizApiService.putSavedQuiz).toHaveBeenCalled();
  });

  it('should clean up the state', () => {
    const service: QuizService = TestBed.inject(QuizService);
    service.isOwner = true;
    service.cleanUp().subscribe(() => {
      expect(service.isOwner).toBe(false);
    });
  });

  it('should persist a quiz in edit mode', () => {
    const service: QuizService = TestBed.inject(QuizService);
    const quizApiService: QuizApiService = TestBed.inject(QuizApiService);

    spyOn(quizApiService, 'putSavedQuiz').and.callFake(() => of(null));

    service['_isInEditMode'] = true;
    service.persistQuiz(quizMock);

    expect(quizApiService.putSavedQuiz).toHaveBeenCalled();
  });

  it('should return the current question', () => {
    const service: QuizService = TestBed.inject(QuizService);

    expect(service.currentQuestion()).toEqual(quizMock.questionList[0]);
  });

  it('should deactivate an active quiz', () => {
    const service: QuizService = TestBed.inject(QuizService);
    const quizApiService: QuizApiService = TestBed.inject(QuizApiService);

    spyOn(quizApiService, 'deleteActiveQuiz').and.callFake(() => of(null));

    service.isOwner = true;
    service.quiz = quizMock;
    service.close();

    expect(quizApiService.deleteActiveQuiz).toHaveBeenCalled();
  });

  it('should check if a quiz is valid', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.quiz = quizMock;

    expect(service.isValid()).toEqual(quizMock.isValid());
  });

  it('should return all visible questions', () => {
    const service: QuizService = TestBed.inject(QuizService);

    expect(service.getVisibleQuestions().length).toEqual(0);
  });

  it('should check if a nick is selected', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.quiz = quizMock;
    service.quiz.sessionConfig.nicks.selectedNicks.push('test-nick');

    expect(service.hasSelectedNick('test-nick')).toEqual(true);
  });

  it('should select or deselect a given nick', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.quiz = quizMock;

    expect(service.hasSelectedNick('test-nick')).toEqual(false);
    service.toggleSelectedNick('test-nick');
    expect(service.hasSelectedNick('test-nick')).toEqual(true);
    service.toggleSelectedNick('test-nick');
    expect(service.hasSelectedNick('test-nick')).toEqual(false);
  });

  it('should add a given nick', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.quiz = quizMock;

    expect(service.hasSelectedNick('test-nick')).toEqual(false);
    service.addSelectedNick('test-nick');
    expect(service.hasSelectedNick('test-nick')).toEqual(true);
  });

  it('should remove a selected nick by name', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.quiz = quizMock;

    service.quiz.sessionConfig.nicks.selectedNicks.push('test-nick');
    expect(service.hasSelectedNick('test-nick')).toEqual(true);
    service.removeSelectedNickByName('test-nick');
    expect(service.hasSelectedNick('test-nick')).toEqual(false);
  });

  it('should load the quiz data to play it', done => {
    const service: QuizService = TestBed.inject(QuizService);
    const storageService: StorageService = TestBed.inject(StorageService);
    const quizApiService: QuizApiService = TestBed.inject(QuizApiService);

    spyOn(storageService.db.Quiz, 'get').and.callFake((): any => new Promise<any>(resolve => resolve(quizMock)));
    spyOn(quizApiService, 'getQuiz').and.callFake(() => of({
      status: StatusProtocol.Success,
      step: null,
      payload: {
        quiz: quizMock,
      },
    }));

    service.loadDataToPlay('quiz-test').then(() => {
      expect(service.quiz).toEqual(quizMock);
      expect(storageService.db.Quiz.get).toHaveBeenCalled();
      expect(quizApiService.getQuiz).toHaveBeenCalled();

      done();
    });
  });

  it('should load the quiz data to edit it', done => {
    const service: QuizService = TestBed.inject(QuizService);
    const storageService: StorageService = TestBed.inject(StorageService);

    spyOn(storageService.db.Quiz, 'get').and.callFake((): any => new Promise<any>(resolve => resolve(quizMock)));

    service.loadDataToEdit('quiz-test');
    service.quizUpdateEmitter.subscribe(val => {
      expect(service.quiz).toEqual(quizMock);
      done();
    });
  });

  it('should stop the edit mode', () => {
    const service: QuizService = TestBed.inject(QuizService);

    service.stopEditMode();
    expect(service['_isInEditMode']).toEqual(false);
  });
});
