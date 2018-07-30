import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { CasLoginService } from '../login/cas-login.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';

import { LanguageLoaderService } from './language-loader.service';

describe('LanguageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [StorageService],
          },
        }), HttpClientTestingModule,
      ],
      providers: [LanguageLoaderService, CasLoginService, UserService, StorageService, IndexedDbService],
    });
  });

  it('should be created', inject([LanguageLoaderService], (service: LanguageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
