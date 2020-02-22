import { TestBed } from '@angular/core/testing';
import { BonusTokenService } from '../bonus-token/bonus-token.service';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {JWT_OPTIONS, JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {jwtOptionsFactory} from '../../../lib/jwt.factory';
import {PLATFORM_ID} from '@angular/core';
import {StorageService} from '../../storage/storage.service';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TranslateService} from '@ngx-translate/core';
import {TranslateServiceMock} from '../../../../_mocks/_services/TranslateServiceMock';
import {StorageServiceMock} from '../../storage/storage.service.mock';
import {UserService} from '../user.service';
import {QuizService} from '../../quiz/quiz.service';
import {QuizMockService} from '../../quiz/quiz-mock.service';
import {AuthorizeApiService} from '../../api/authorize/authorize-api.service';
import {AuthorizeApiServiceMock} from '../../../../_mocks/_services/AuthorizeApiServiceMock';

describe('BonusTokenService', () => {
  let service: BonusTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), RouterTestingModule, HttpClientTestingModule
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
        HttpClient, HttpHandler, JwtHelperService,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    });
    service = TestBed.inject(BonusTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
