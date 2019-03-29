import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { of } from 'rxjs';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { QuizApiService } from '../../service/api/quiz/quiz-api.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { CasLoginService } from '../../service/login/cas-login.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
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
    subscribe: (next) => (next({ ticket: 'testCasTicket' })),
    toPromise: () => (new Promise(resolve => resolve({ ticket: 'testCasTicket' }))),
  };
  public params = {
    subscribe: (next) => (next({ quizName: 'test' })),
    toPromise: () => (new Promise(resolve => resolve({ quizName: 'test' }))),
  };
}

describe('QuizJoinComponent', () => {
  let component: QuizJoinComponent;
  let fixture: ComponentFixture<QuizJoinComponent>;

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
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, CasLoginService, QuizApiService, {
          provide: QuizService,
          useClass: QuizMockService,
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
      status: StatusProtocol.Failed,
      step: MessageProtocol.Unavailable,
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

  it('should add a casTicket to the casService if a casTicket is supplied', async(inject([Router, QuizService, CasLoginService, QuizApiService],
    (router: Router, quizService: QuizService, casService: CasLoginService, quizApiService: QuizApiService) => {
      const quizStatusData = {
        status: StatusProtocol.Success,
        step: MessageProtocol.Available,
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit();
      expect(casService.casLoginRequired).toBeTruthy();
      expect(casService.quizName).toEqual('test');
    })));

  it('should redirect the user to the membergroup selection if there are multiple groups available',
    async(inject([Router, QuizService, QuizApiService], (router: Router, quizService: QuizService, quizApiService: QuizApiService) => {
      const customQuiz = quizService.quiz;
      customQuiz.sessionConfig.nicks.memberGroups = ['Group1', 'Group2'];
      const quizStatusData = {
        status: StatusProtocol.Success,
        step: MessageProtocol.Available,
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'memberGroup']);
    })));

  it('should redirect the user to input the nickname if no predefined nicks are available',
    async(inject([QuizService, Router, QuizApiService], (quizService: QuizService, router: Router, quizApiService: QuizApiService) => {
      const quizStatusData = {
        status: StatusProtocol.Success,
        step: MessageProtocol.Available,
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'input']);
    })));

  it('should redirect the user to the nickname selection if predefined nicks are available',
    async(inject([QuizService, Router, QuizApiService], (quizService: QuizService, router: Router, quizApiService: QuizApiService) => {

      const customQuiz = quizService.quiz;
      customQuiz.sessionConfig.nicks.addSelectedNick('Predefined1');
      customQuiz.sessionConfig.nicks.addSelectedNick('Predefined2');
      const quizStatusData = {
        status: StatusProtocol.Success,
        step: MessageProtocol.Available,
        payload: {
          authorizeViaCas: true,
          provideNickSelection: true,
        },
      };

      spyOn(quizApiService, 'getQuizStatus').and.returnValue(of(quizStatusData));
      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'select']);
    })));
});
