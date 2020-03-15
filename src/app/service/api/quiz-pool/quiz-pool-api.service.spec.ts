import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { QuizPoolApiService } from './quiz-pool-api.service';

describe('QuizPoolApiService', () => {
  let service: QuizPoolApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, I18nTestingModule, JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [PLATFORM_ID],
        },
      })],
      providers: [RxStompService, SimpleMQ],
    });
    service = TestBed.inject(QuizPoolApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
