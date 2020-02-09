import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { I18nManagerApiService } from '../../service/api/i18n-manager/i18n-manager-api.service';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { UnusedKeyFilterPipe } from './unused-key-filter.pipe';

describe('UnusedKeyFilterPipe', () => {
  let pipe: UnusedKeyFilterPipe;
  const mockValues = [
    {
      key: 'test1key',
      value: 'test1value',
    }, {
      key: 'test2key',
      value: 'test2value',
    }, {
      key: 'unused-key',
      value: 'unused-value',
    },
  ];

  beforeEach(async(() => {
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
        {
          provide: LanguageLoaderService,
          useValue: {
            unusedKeys: ['unused-key'],
          },
        }, I18nManagerApiService, ProjectLoaderService, {
          provide: UserService,
          useValue: {},
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        },
      ],
      declarations: [
        UnusedKeyFilterPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    pipe = new UnusedKeyFilterPipe(TestBed.inject(LanguageLoaderService));
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return only the unused keys of the value', () => {
    expect(pipe.transform(mockValues, true).length).toEqual(1);
  });

  it('should return only the used keys of the value', () => {
    expect(pipe.transform(mockValues).length).toEqual(2);
  });
});
