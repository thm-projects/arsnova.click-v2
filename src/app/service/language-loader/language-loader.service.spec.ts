import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

import { LanguageLoaderService } from './language-loader.service';

describe('LanguageLoaderService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), HttpClientTestingModule,
      ],
      providers: [
        LanguageLoaderService, {
          provide: UserService,
          useValue: {},
        }, StorageService,
      ],
    });
  }));

  it('should be created', inject([LanguageLoaderService], (service: LanguageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
