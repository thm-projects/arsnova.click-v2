import {async, inject, TestBed} from '@angular/core/testing';

import {CurrentQuizService} from './current-quiz.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {FooterBarService} from './footer-bar.service';
import {SettingsService} from './settings.service';
import {ConnectionService} from './connection.service';
import {WebsocketService} from './websocket.service';
import {SharedService} from './shared.service';
import {createTranslateLoader} from '../../lib/translation.factory';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {WebsocketMockService} from './websocket.mock.service';
import {CurrentQuizMockService} from './current-quiz.mock.service';
import {ConnectionMockService} from './connection.mock.service';

describe('CurrentQuizService', () => {
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
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService
      ]
    });
  }));

  it('should be created', async(inject([CurrentQuizService], (service: CurrentQuizService) => {
    expect(service).toBeTruthy();
  })));
});
