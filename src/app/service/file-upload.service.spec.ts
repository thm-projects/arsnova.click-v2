import {async, inject, TestBed} from '@angular/core/testing';

import {FileUploadService} from './file-upload.service';
import {ActiveQuestionGroupService} from './active-question-group.service';
import {ConnectionService} from './connection.service';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {FooterBarService} from './footer-bar.service';
import {SharedService} from './shared.service';
import {CurrentQuizService} from './current-quiz.service';
import {SettingsService} from './settings.service';
import {WebsocketService} from './websocket.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {WebsocketMockService} from './websocket.mock.service';
import {CurrentQuizMockService} from './current-quiz.mock.service';
import {ConnectionMockService} from './connection.mock.service';
import {ActiveQuestionGroupMockService} from './active-question-group.mock.service';

describe('FileUploadService', () => {
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
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        FileUploadService
      ]
    });
  }));

  it('should be created', async(inject([FileUploadService], (service: FileUploadService) => {
    expect(service).toBeTruthy();
  })));
});
