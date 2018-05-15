import {async, inject, TestBed} from '@angular/core/testing';

import {ActiveQuestionGroupService} from './active-question-group.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ConnectionService} from './connection.service';
import {createTranslateLoader} from '../../lib/translation.factory';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {SettingsService} from './settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from './footer-bar.service';
import {SharedService} from './shared.service';
import {CurrentQuizService} from './current-quiz.service';
import {WebsocketService} from './websocket.service';
import {WebsocketMockService} from './websocket.mock.service';
import {CurrentQuizMockService} from './current-quiz.mock.service';
import {ConnectionMockService} from './connection.mock.service';

describe('ActiveQuestionGroupService', () => {
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
        ActiveQuestionGroupService
      ]
    });
  }));

  it('should be created', async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    expect(service).toBeTruthy();
  })));
});
