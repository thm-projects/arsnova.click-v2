import {async, inject, TestBed} from '@angular/core/testing';

import {ThemesService} from './themes.service';
import {CurrentQuizService} from './current-quiz.service';
import {ConnectionService} from './connection.service';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from './footer-bar.service';
import {SharedService} from './shared.service';
import {SettingsService} from './settings.service';
import {WebsocketService} from './websocket.service';
import {WebsocketMockService} from './websocket.mock.service';
import {CurrentQuizMockService} from './current-quiz.mock.service';
import {ConnectionMockService} from './connection.mock.service';

describe('ThemesService', () => {
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
        {provide: ConnectionService, useClass: ConnectionMockService},
        TranslateService,
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        ThemesService
      ]
    });
  }));

  it('should be created', async(inject([ThemesService], (service: ThemesService) => {
    expect(service).toBeTruthy();
  })));
});
