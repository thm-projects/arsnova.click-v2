import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { of } from 'rxjs/index';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { LobbyApiService } from '../../service/api/lobby/lobby-api.service';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { IndexedDbService } from '../../service/storage/indexed.db.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { UserService } from '../../service/user/user.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { SharedModule } from '../../shared/shared.module';

import { QuizJoinComponent } from './quiz-join.component';

class MockRouter {
  public queryParams = {
    subscribe: (next) => (
      next({ ticket: 'testCasTicket' })
    ),
    toPromise: () => (
      new Promise(resolve => resolve({ ticket: 'testCasTicket' }))
    ),
  };
  public params = {
    subscribe: (next) => (
      next({ quizName: 'test' })
    ),
    toPromise: () => (
      new Promise(resolve => resolve({ quizName: 'test' }))
    ),
  };
}

describe('QuizJoinComponent', () => {
  let component: QuizJoinComponent;
  let fixture: ComponentFixture<QuizJoinComponent>;

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
        }, CasLoginService, LobbyApiService, QuizApiService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, UserService, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, {
          provide: ActivatedRoute,
          useClass: MockRouter,
        }, SharedService,
      ],
      declarations: [QuizJoinComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(QuizJoinComponent.TYPE).toEqual('QuizJoinComponent');
  }));

  it('should redirect the user to / on failure', async(inject([Router, QuizApiService], (router: Router, quizApiService: QuizApiService) => {
    const quizStatusData = {
      status: 'STATUS:FAILED',
      step: 'QUIZ:UNAVAILABLE',
      payload: {
        authorizeViaCas: true,
        provideNickSelection: false,
      },
    };

    spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
    spyOn(router, 'navigate').and.callFake(() => {});

    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  })));

  it('should add a cas casTicket to the casService if a casTicket is supplied',
    async(inject([Router, CurrentQuizService, CasLoginService, QuizApiService, LobbyApiService], (
      router: Router,
      currentQuizService: CurrentQuizService,
      casService: CasLoginService,
      quizApiService: QuizApiService,
      lobbyApiService: LobbyApiService,
    ) => {
      const quizStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };
      const lobbyStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          quiz: {
            originalObject: currentQuizService.quiz.serialize(),
          },
        },
      };

      spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
      spyOn(lobbyApiService, 'getLobbyStatus').and.returnValue(of(lobbyStatusData));
      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit();
      expect(casService.casLoginRequired).toBeTruthy();
      expect(casService.quizName).toEqual('test');
    })));

  it('should redirect the user to the membergroup selection if there are multiple groups available', async(
    inject([Router, CurrentQuizService, QuizApiService, LobbyApiService],
      (router: Router, currentQuizService: CurrentQuizService, quizApiService: QuizApiService, lobbyApiService: LobbyApiService) => {
        const customQuiz = currentQuizService.quiz;
        customQuiz.sessionConfig.nicks.memberGroups = ['Group1', 'Group2'];
        const quizStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            authorizeViaCas: true,
            provideNickSelection: false,
          },
        };
        const lobbyStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            quiz: {
              originalObject: customQuiz.serialize(),
            },
          },
        };

        spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
        spyOn(lobbyApiService, 'getLobbyStatus').and.returnValue(of(lobbyStatusData));
        spyOn(router, 'navigate').and.callFake(() => {});

        component.ngOnInit();
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'memberGroup']);
      })));

  it('should redirect the user to input the nickname if no predefined nicks are available', async(
    inject([CurrentQuizService, Router, QuizApiService, LobbyApiService],
      (currentQuizService: CurrentQuizService, router: Router, quizApiService: QuizApiService, lobbyApiService: LobbyApiService) => {
        const quizStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            authorizeViaCas: true,
            provideNickSelection: false,
          },
        };
        const lobbyStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            quiz: {
              originalObject: currentQuizService.quiz.serialize(),
            },
          },
        };

        spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
        spyOn(lobbyApiService, 'getLobbyStatus').and.returnValue(of(lobbyStatusData));
        spyOn(router, 'navigate').and.callFake(() => {});

        component.ngOnInit();
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'input']);
      })));

  it('should redirect the user to the nickname selection if predefined nicks are available', async(
    inject([CurrentQuizService, Router, QuizApiService, LobbyApiService],
      (currentQuizService: CurrentQuizService, router: Router, quizApiService: QuizApiService, lobbyApiService: LobbyApiService) => {

        const customQuiz = currentQuizService.quiz;
        customQuiz.sessionConfig.nicks.addSelectedNick('Predefined1');
        customQuiz.sessionConfig.nicks.addSelectedNick('Predefined2');
        const quizStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            authorizeViaCas: true,
            provideNickSelection: true,
          },
        };
        const lobbyStatusData = {
          status: 'STATUS:SUCCESSFUL',
          step: 'QUIZ:AVAILABLE',
          payload: {
            quiz: {
              originalObject: customQuiz.serialize(),
            },
          },
        };

        spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
        spyOn(lobbyApiService, 'getLobbyStatus').and.returnValue(of(lobbyStatusData));
        spyOn(router, 'navigate').and.callFake(() => {});

        component.ngOnInit();
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'select']);
      })));
});
