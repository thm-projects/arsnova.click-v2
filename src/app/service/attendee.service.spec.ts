import {async, inject, TestBed} from '@angular/core/testing';

import {AttendeeService} from './attendee.service';
import {FooterBarService} from './footer-bar.service';
import {CurrentQuizService} from './current-quiz.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {createTranslateLoader} from '../../lib/translation.factory';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {SettingsService} from './settings.service';
import {ConnectionService} from './connection.service';
import {WebsocketService} from './websocket.service';
import {SharedService} from './shared.service';
import {WebsocketMockService} from './websocket.mock.service';
import {CurrentQuizMockService} from './current-quiz.mock.service';
import {ConnectionMockService} from './connection.mock.service';

describe('AttendeeService', () => {
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
        SharedService,
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ConnectionService, useClass: ConnectionMockService},
        SettingsService,
        TranslateService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        FooterBarService,
        AttendeeService
      ]
    });
  }));

  it('should be created', async(inject([AttendeeService], (service: AttendeeService) => {
    expect(service).toBeTruthy();
  })));
});
