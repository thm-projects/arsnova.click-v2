import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { AuthorizeApiServiceMock } from '../../../_mocks/_services/AuthorizeApiServiceMock';
import { UserRole } from '../../lib/enums/UserRole';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { AuthorizeApiService } from '../api/authorize/authorize-api.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UserService } from './user.service';

describe('UserService', () => {
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
        }, UserService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: AuthorizeApiService,
          useClass: AuthorizeApiServiceMock,
        },
      ],
    });
  }));

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    const service = TestBed.get(UserService);
    expect(service).toBeTruthy();
  });

  it('should set the username if a login token is provided', () => {
    const service: UserService = TestBed.get(UserService);
    const jwtHelper: JwtHelperService = TestBed.get(JwtHelperService);
    spyOn(jwtHelper, 'decodeToken').and.callFake(() => (
      { name: 'test-name' }
    ));
    service['_staticLoginToken'] = 'test-token';

    service.isLoggedIn = true;
    expect(jwtHelper.decodeToken).toHaveBeenCalled();
    expect(service.username).toEqual('test-name');
  });

  it('should logout a user', () => {
    const service: UserService = TestBed.get(UserService);
    const jwtHelper: JwtHelperService = TestBed.get(JwtHelperService);
    spyOn(jwtHelper, 'decodeToken').and.callFake(() => (
      { name: 'test-name' }
    ));
    service['_staticLoginToken'] = 'test-token';
    service.isLoggedIn = true;

    service.logout();
    expect(service.isLoggedIn).toBe(false);
  });

  it('should succeed if a casTicket is provided', done => {
    const service: UserService = TestBed.get(UserService);
    const jwtHelper: JwtHelperService = TestBed.get(JwtHelperService);
    spyOn(jwtHelper, 'decodeToken').and.callFake(() => (
      { name: 'test-name' }
    ));
    service['_staticLoginToken'] = 'test-token';

    service.authenticateThroughCas('').then(succeeded => {
      expect(succeeded).toBe(true);
      expect(service.isLoggedIn).toBe(true);
      expect(service.casTicket).toEqual('test-ticket');
      done();
    });
  });

  it('should not succeed if no casTicket is provided', done => {
    const service: UserService = TestBed.get(UserService);

    service.authenticateThroughCas('no-token').then(succeeded => {
      expect(succeeded).toBe(false);
      expect(service.isLoggedIn).toBe(false);
      expect(service.casTicket).toEqual(null);
      done();
    });
  });

  it('should authenticate through the username:password login', done => {
    const service: UserService = TestBed.get(UserService);
    const jwtHelper: JwtHelperService = TestBed.get(JwtHelperService);
    spyOn(jwtHelper, 'decodeToken').and.callFake(() => (
      { name: 'test-name' }
    ));

    service.authenticateThroughLogin('test-name', 'test-pass').then(succeeded => {
      expect(succeeded).toBe(true);
      expect(service.isLoggedIn).toBe(true);
      expect(service['_staticLoginToken']).toEqual('test-token');
      done();
    });
  });

  it('should authenticate with a login token', done => {
    const service: UserService = TestBed.get(UserService);
    const jwtHelper: JwtHelperService = TestBed.get(JwtHelperService);
    spyOn(jwtHelper, 'decodeToken').and.callFake(() => (
      { name: service.username }
    ));

    service.authenticateThroughLoginToken('test-token-hash').then(succeeded => {
      expect(succeeded).toBe(true);
      expect(service.isLoggedIn).toBe(true);
      expect(service['_staticLoginToken']).toEqual('test-token');
      expect(service.username).toEqual('test-token-user');
      done();
    });
  });

  it('should hash a password', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service.hashPassword('my-user', 'my-password')).toEqual('25f4044f7c85492260cbae4b7d66c1c9a2e50bce');
  });

  it('should hash a token', () => {
    const service: UserService = TestBed.get(UserService);
    expect(service.hashToken('my-token')).toEqual('6578fca8b62f49457e4cd7e66554a310a1a64be8');
  });

  it('should return true if a user is authorized for a role', () => {
    const service: UserService = TestBed.get(UserService);
    service['_staticLoginTokenContent'] = {
      name: null,
      passwordHash: null,
      gitlabToken: null,
      userAuthorizations: [UserRole.CreateQuiz],
    };

    expect(service.isAuthorizedFor(UserRole.CreateQuiz)).toEqual(true);
  });

  it('should return false if a user is not authorized for a role', () => {
    const service: UserService = TestBed.get(UserService);
    service['_staticLoginTokenContent'] = {
      name: null,
      passwordHash: null,
      gitlabToken: null,
      userAuthorizations: [UserRole.CreateQuiz],
    };

    expect(service.isAuthorizedFor(UserRole.CreateExpiredQuiz)).toEqual(false);
  });
});
