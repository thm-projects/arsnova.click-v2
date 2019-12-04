import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { Filter, Language } from '../../lib/enums/enums';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { I18nManagerApiService } from '../../service/api/i18n-manager/i18n-manager-api.service';
import { LanguageLoaderService } from '../../service/language-loader/language-loader.service';
import { ProjectLoaderService } from '../../service/project-loader/project-loader.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { UserService } from '../../service/user/user.service';
import { FilterKeysPipe } from './filter-keys.pipe';

describe('FilterKeysPipe', () => {
  let pipe: FilterKeysPipe;
  const mockValues = [
    {
      key: 'test1key',
      value: {
        [Language.DE]: 'test1value',
        [Language.EN]: 'test1value',
        [Language.FR]: 'test1value',
      },
    }, {
      key: 'test2key',
      value: {
        [Language.DE]: 'test2value',
        [Language.EN]: 'test2value',
      },
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
            language: Language.DE,
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
        FilterKeysPipe,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    pipe = new FilterKeysPipe(TestBed.get(LanguageLoaderService));
  }));

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the original value if no filter is set', () => {
    expect(pipe.transform(mockValues, Filter.None)).toEqual(mockValues);
  });

  it('should return true if the current language setting has more keys then the filtered one', () => {
    expect(pipe.transform(mockValues, Filter.InvalidKeys).length).toEqual(0);
  });

  it('should return false if the language files have DE keys', () => {
    expect(pipe.transform(mockValues, Filter.InvalidDE).length).toEqual(0);
  });

  it('should return false if the language files have EN keys', () => {
    expect(pipe.transform(mockValues, Filter.InvalidEN).length).toEqual(0);
  });

  it('should return false if the language files have FR keys', () => {
    expect(pipe.transform(mockValues, Filter.InvalidFr).length).toEqual(1);
  });

  it('should return false if the language files do not have ES keys', () => {
    expect(pipe.transform(mockValues, Filter.InvalidES).length).toBeGreaterThan(0);
  });

  it('should return false if the language files do not have IT keys', () => {
    expect(pipe.transform(mockValues, Filter.InvalidIt).length).toBeGreaterThan(0);
  });
});
