import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/dist/questions/question_choice_single';
import { SessionConfiguration } from 'arsnova-click-v2-types/dist/session_configuration/session_config';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizMockService } from '../current-quiz/current-quiz.mock.service';
import { QuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { QuizService } from './quiz.service';

describe('QuizService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, TranslateService, {
          provide: QuizService,
          useClass: CurrentQuizMockService,
        }, FooterBarService, QuizService,
      ],
    });
  }));

  beforeEach(async(inject([QuizService], (service: QuizService) => {
    service.quiz = new QuizEntity({
      name: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings.sessionConfig),
      questionList: [
        new SingleChoiceQuestion({}),
      ],
    });
    service.isOwner = true;
  })));

  it('should be created', async(inject([QuizService], (service: QuizService) => {
    expect(service).toBeTruthy();
  })));

  it('#generatePrivateKey', async(inject([QuizService], (service: QuizService) => {
    const privateKey = service.generatePrivateKey();
    expect(typeof privateKey).toEqual('string');
  })));

  it('#persist', async(inject([QuizService, StorageService], (service: QuizService, storageService: StorageService) => {
    service.persist();
    storageService.getAllQuiznames().then(quiznames => {
      expect(quiznames).toContain('test');
    });
  })));

  it('#updateFooterElementsState', async(inject([QuizService, FooterBarService], (service: QuizService, footerBarService: FooterBarService) => {
    const defaultNickConfig = DefaultSettings.defaultQuizSettings.sessionConfig.nicks;
    service.updateFooterElementsState();

    expect(footerBarService.footerElemEnableCasLogin.isActive).toEqual(defaultNickConfig.restrictToCasLogin);
    expect(footerBarService.footerElemBlockRudeNicknames.isActive).toEqual(defaultNickConfig.blockIllegalNicks);
  })));
});
