import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { DB_TABLE, STORAGE_KEY } from '../../shared/enums';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizMockService } from '../current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { ActiveQuestionGroupService } from './active-question-group.service';

describe('ActiveQuestionGroupService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, TranslateService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, FooterBarService, ActiveQuestionGroupService,
      ],
    });
  }));

  beforeEach(async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    service.activeQuestionGroup = new DefaultQuestionGroup({
      hashtag: 'test',
      sessionConfig: new SessionConfiguration(DefaultSettings.defaultQuizSettings),
      questionList: [
        new SingleChoiceQuestion({}),
      ],
    });
  })));

  it('should be created', async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    expect(service).toBeTruthy();
  })));

  it('#generatePrivateKey', async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    const privateKey = service.generatePrivateKey();
    expect(typeof privateKey).toEqual('string');
  })));

  it('#cleanUp', async(inject([ActiveQuestionGroupService, StorageService], (service: ActiveQuestionGroupService, storageService: StorageService) => {
    storageService.create(DB_TABLE.CONFIG, STORAGE_KEY.ACTIVE_QUESTION_GROUP, JSON.stringify(service.activeQuestionGroup.serialize())).subscribe();
    service.cleanUp();
    storageService.read(DB_TABLE.CONFIG, STORAGE_KEY.ACTIVE_QUESTION_GROUP).toPromise().then(result => {
      expect(result).toBe(null);
    });
  })));

  it('#persist', async(inject([ActiveQuestionGroupService, StorageService], (service: ActiveQuestionGroupService, storageService: StorageService) => {
    service.persist().then(() => {
      storageService.getAllQuiznames().then(quiznames => {
        expect(quiznames).toContain('test');
      });
    });
  })));

  it('#updateFooterElementsState',
    async(inject([ActiveQuestionGroupService, FooterBarService], (service: ActiveQuestionGroupService, footerBarService: FooterBarService) => {
      const defaultNickConfig = DefaultSettings.defaultQuizSettings.nicks;
      service.updateFooterElementsState();

      expect(footerBarService.footerElemEnableCasLogin.isActive).toEqual(defaultNickConfig.restrictToCasLogin);
      expect(footerBarService.footerElemBlockRudeNicknames.isActive).toEqual(defaultNickConfig.blockIllegalNicks);
    })));
});
