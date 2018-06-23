import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SingleChoiceQuestion } from 'arsnova-click-v2-types/src/questions/question_choice_single';
import { DefaultQuestionGroup } from 'arsnova-click-v2-types/src/questions/questiongroup_default';
import { SessionConfiguration } from 'arsnova-click-v2-types/src/session_configuration/session_config';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizMockService } from '../current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { ActiveQuestionGroupService } from './active-question-group.service';

describe('ActiveQuestionGroupService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, TranslateModule.forRoot({
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
        SharedService, {
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

  it('#cleanUp', async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    window.sessionStorage.setItem('config.active_question_group', 'test');
    service.cleanUp();
    expect(window.sessionStorage.getItem('config.active_question_group')).toBe(null);
  })));

  it('#persist', async(inject([ActiveQuestionGroupService], (service: ActiveQuestionGroupService) => {
    service.persist();
    expect(window.localStorage.getItem('test')).toEqual(JSON.stringify(service.activeQuestionGroup.serialize()));
    expect(JSON.parse(window.localStorage.getItem('config.owned_quizzes'))).toContain('test');
  })));

  it('#updateFooterElementsState',
    async(inject([ActiveQuestionGroupService, FooterBarService], (service: ActiveQuestionGroupService, footerBarService: FooterBarService) => {
      const defaultNickConfig = DefaultSettings.defaultQuizSettings.nicks;
      service.updateFooterElementsState();

      expect(footerBarService.footerElemEnableCasLogin.isActive).toEqual(defaultNickConfig.restrictToCasLogin);
      expect(footerBarService.footerElemBlockRudeNicknames.isActive).toEqual(defaultNickConfig.blockIllegalNicks);
    })));
});
