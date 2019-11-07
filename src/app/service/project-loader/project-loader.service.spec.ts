import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { UserService } from '../user/user.service';

import { ProjectLoaderService } from './project-loader.service';

describe('ProjectLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, ProjectLoaderService, {
          provide: UserService,
          useValue: {},
        },
      ],
    });
  });

  it('should be created', inject([ProjectLoaderService], (service: ProjectLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
