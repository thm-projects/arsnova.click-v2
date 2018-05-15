import {async, inject, TestBed} from '@angular/core/testing';

import {I18nService} from './i18n.service';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';

describe('I18nService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          }
        }),
      ],
      providers: [
        TranslateService,
        I18nService
      ]
    });
  }));

  it('should be created', async(inject([I18nService], (service: I18nService) => {
    expect(service).toBeTruthy();
  })));
});
