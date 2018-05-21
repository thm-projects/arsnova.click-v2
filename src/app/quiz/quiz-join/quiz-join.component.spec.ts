import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { CasService } from '../../service/cas/cas.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { UserService } from '../../service/user/user.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';

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
  let backend: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
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
        CasService,
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        { provide: ThemesService, useClass: ThemesMockService },
        UserService,
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        { provide: ActivatedRoute, useClass: MockRouter },
        SharedService,
      ],
      declarations: [QuizJoinComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizJoinComponent);
    backend = TestBed.get(HttpTestingController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    backend.verify();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', () => {
    expect(QuizJoinComponent.TYPE).toEqual('QuizJoinComponent');
  });

  it('should redirect the user to / on failure',
    async(inject([Router], (router: Router) => {
        const quizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status/test`;
        const quizStatusData = {
          status: 'STATUS:FAILED',
          step: 'QUIZ:UNAVAILABLE',
          payload: {
            authorizeViaCas: true,
            provideNickSelection: false,
          },
        };

        spyOn(router, 'navigate').and.callThrough();

        component.ngOnInit().subscribe(value => {
          backend.expectOne(quizStatusUrl).flush(quizStatusData);
          expect(router.navigate).toHaveBeenCalledWith(['/']);
        });
      }),
    ),
  );

  it('should add a cas ticket to the casService if a ticket is supplied', async(inject(
    [Router, CurrentQuizService, CasService],
    (router: Router, currentQuizService: CurrentQuizService, casService: CasService) => {

      const quizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status/test`;
      const quizStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      const quizDataUrl = `${DefaultSettings.httpApiEndpoint}/lobby/test`;
      const quizData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          quiz: {
            originalObject: currentQuizService.quiz.serialize(),
          },
        },
      };

      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit().subscribe(value => {
        backend.expectOne(quizStatusUrl).flush(quizStatusData);
        backend.expectOne(quizDataUrl).flush(quizData);
        expect(casService.casLoginRequired).toBeTruthy();
        expect(casService.quizName).toEqual('test');
      });
    })));

  it('should redirect the user to the membergroup selection if there are multiple groups available', async(inject(
    [Router, CurrentQuizService],
    (router: Router, currentQuizService: CurrentQuizService) => {
      const quizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status/test`;
      const quizStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      const quizDataUrl = `${DefaultSettings.httpApiEndpoint}/lobby/test`;
      const customQuiz = currentQuizService.quiz;
      customQuiz.sessionConfig.nicks.memberGroups = ['Group1', 'Group2'];
      const quizData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          quiz: {
            originalObject: customQuiz.serialize(),
          },
        },
      };

      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit().subscribe(value => {
        backend.expectOne(quizStatusUrl).flush(quizStatusData);
        backend.expectOne(quizDataUrl).flush(quizData);
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'memberGroup']);
      });
    })));

  it('should redirect the user to input the nickname if no predefined nicks are available', async(inject(
    [CurrentQuizService, Router],
    (currentQuizService: CurrentQuizService, router: Router) => {
      const quizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status/test`;
      const quizStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          authorizeViaCas: true,
          provideNickSelection: false,
        },
      };

      const quizDataUrl = `${DefaultSettings.httpApiEndpoint}/lobby/test`;
      const quizData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          quiz: {
            originalObject: currentQuizService.quiz.serialize(),
          },
        },
      };

      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit().subscribe(value => {
        backend.expectOne(quizStatusUrl).flush(quizStatusData);
        backend.expectOne(quizDataUrl).flush(quizData);
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'input']);
      });
    })));

  it('should redirect the user to the nickname selection if predefined nicks are available', async(inject(
    [CurrentQuizService, Router],
    (currentQuizService: CurrentQuizService, router: Router) => {
      const quizStatusUrl = `${DefaultSettings.httpApiEndpoint}/quiz/status/test`;
      const quizStatusData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          authorizeViaCas: true,
          provideNickSelection: true,
        },
      };

      const quizDataUrl = `${DefaultSettings.httpApiEndpoint}/lobby/test`;
      const customQuiz = currentQuizService.quiz;
      customQuiz.sessionConfig.nicks.addSelectedNick('Predefined1');
      customQuiz.sessionConfig.nicks.addSelectedNick('Predefined2');
      const quizData = {
        status: 'STATUS:SUCCESSFUL',
        step: 'QUIZ:AVAILABLE',
        payload: {
          quiz: {
            originalObject: customQuiz.serialize(),
          },
        },
      };

      spyOn(router, 'navigate').and.callFake(() => {});

      component.ngOnInit().subscribe(() => {
        backend.expectOne(quizStatusUrl).flush(quizStatusData);
        backend.expectOne(quizDataUrl).flush(quizData);
        expect(router.navigate).toHaveBeenCalledWith(['/nicks', 'select']);
      });
    })));
});
