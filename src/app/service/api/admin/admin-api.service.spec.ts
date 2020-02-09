import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { of } from 'rxjs';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { StorageService } from '../../storage/storage.service';
import { UserService } from '../../user/user.service';
import { AdminApiService } from './admin-api.service';

describe('AdminApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        {
          provide: UserService,
          useValue: {},
        }, JwtHelperService,
      ],
    });
  });

  it('should be created', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    expect(service).toBeTruthy();
  });

  it('#getAvailableUsers', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.callFake(() => of(null));
    service.getAvailableUsers();
    expect(http.get).toHaveBeenCalledWith(service['_getAvailableUsersUrl'], { headers: { authorization: undefined } });
  });

  it('#getAvailableQuizzes', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.callFake(() => of(null));
    service.getAvailableQuizzes();
    expect(http.get).toHaveBeenCalledWith(service['_getAvailableQuizzesUrl'], { headers: { authorization: undefined } });
  });

  it('#deleteQuiz', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'delete').and.callFake(() => of(null));
    service.deleteQuiz('test-quiz');
    expect(http.delete).toHaveBeenCalledWith(service['_deleteQuizUrl'] + '/test-quiz', { headers: { authorization: undefined } });
  });

  it('#deleteUser', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'delete').and.callFake(() => of(null));
    service.deleteUser('test-user');
    expect(http.delete).toHaveBeenCalledWith(service['_deleteUserUrl'] + '/test-user', { headers: { authorization: undefined } });
  });

  it('#updateUser', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'put').and.callFake(() => of(null));
    const newUser = {};
    service.updateUser(newUser);
    expect(http.put).toHaveBeenCalledWith(service['_putUserUrl'], newUser, { headers: { authorization: undefined } });
  });

  it('#getQuiz', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'get').and.callFake(() => of(null));
    service.getQuiz('test-quiz');
    expect(http.get).toHaveBeenCalledWith(service['_getQuizUrl'] + '/test-quiz', { headers: { authorization: undefined } });
  });

  it('#deactivateQuiz', () => {
    const service: AdminApiService = TestBed.inject(AdminApiService);
    const http: HttpClient = TestBed.inject(HttpClient);
    spyOn(http, 'post').and.callFake(() => of(null));
    service.deactivateQuiz('test-quiz');
    expect(http.post).toHaveBeenCalledWith(service['_postQuizDeactivateUrl'], { quizname: 'test-quiz' }, { headers: { authorization: undefined } });
  });
});
