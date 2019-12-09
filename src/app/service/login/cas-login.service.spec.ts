import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { MessageProtocol, StatusProtocol } from '../../lib/enums/Message';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { QuizApiService } from '../api/quiz/quiz-api.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UserService } from '../user/user.service';
import { CasLoginService } from './cas-login.service';

describe('CasLoginService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: UserService,
          useValue: {
            authenticateThroughCas: () => {},
          },
        }, CasLoginService,
      ],
    });
  }));

  it('should be created', () => {
    const service: CasLoginService = TestBed.get(CasLoginService);
    expect(service).toBeTruthy();
  });

  it('should be activated', () => {
    const service: CasLoginService = TestBed.get(CasLoginService);

    spyOn(service, 'canLoad').and.callFake(() => new Promise(resolve => resolve()));

    service.canActivate();

    expect(service.canLoad).toHaveBeenCalled();
  });

  it('should be loaded if the user is already logged in', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);
    const userService: UserService = TestBed.get(UserService);

    userService.isLoggedIn = true;

    service.canLoad().then(result => {
      expect(result).toEqual(true);
      done();
    });
  });

  it('should be loaded if no cas login is required', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);

    service.casLoginRequired = false;

    service.canLoad().then(result => {
      expect(result).toEqual(true);
      done();
    });
  });

  it('should be loaded if a ticket is provided', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);
    const userService: UserService = TestBed.get(UserService);

    service.casLoginRequired = true;
    service.ticket = 'cas-ticket';
    spyOn(userService, 'authenticateThroughCas').and.callFake(() => new Promise(resolve => resolve(true)));

    service.canLoad().then(result => {
      expect(userService.authenticateThroughCas).toHaveBeenCalled();
      expect(result).toEqual(true);
      done();
    });
  });

  it('should not be loaded if no quiz name is provided', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);

    service.quizName = null;
    service.casLoginRequired = true;

    service.canLoad().then(result => {
      expect(result).toEqual(false);
      done();
    });
  });

  it('should not be loaded if cas login is required', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);
    const quizApiService: QuizApiService = TestBed.get(QuizApiService);

    spyOn(quizApiService, 'getQuizStatus').and.callFake(() => of({
      status: StatusProtocol.Failed,
      step: MessageProtocol.CasLoginRequired,
      payload: {
        authorizeViaCas: true,
      },
    }));
    service.quizName = 'test-quiz';
    service.casLoginRequired = true;

    service.canLoad().then(result => {
      expect(result).toEqual(true);
      done();
    });
  });

  it('should be loaded if no cas login is required', done => {
    const service: CasLoginService = TestBed.get(CasLoginService);
    const quizApiService: QuizApiService = TestBed.get(QuizApiService);

    spyOn(quizApiService, 'getQuizStatus').and.callFake(() => of({
      status: StatusProtocol.Failed,
      step: MessageProtocol.CasLoginRequired,
      payload: {
        authorizeViaCas: false,
      },
    }));
    service.quizName = 'test-quiz';
    service.casLoginRequired = true;

    service.canLoad().then(result => {
      expect(result).toEqual(true);
      done();
    });
  });
});
