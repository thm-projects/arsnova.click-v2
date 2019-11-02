import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { SharedModule } from '../../../shared/shared.module';
import { IndexedDbService } from '../../storage/indexed.db.service';
import { StorageService } from '../../storage/storage.service';
import { UserService } from '../../user/user.service';

import { AdminApiService } from './admin-api.service';

describe('AdminApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        IndexedDbService, UserService, JwtHelperService,
      ],
    });
  });

  it('should be created', () => {
    const service: AdminApiService = TestBed.get(AdminApiService);
    expect(service).toBeTruthy();
  });
});
