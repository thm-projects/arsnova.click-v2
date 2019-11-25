import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { DefaultSettings } from '../../lib/default.settings';
import { SingleChoiceQuestionEntity } from '../../lib/entities/question/SingleChoiceQuestionEntity';
import { QuizEntity } from '../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../lib/entities/session-configuration/SessionConfigurationEntity';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { QuizService } from './quiz.service';

describe('QuizService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, RxStompService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, FooterBarService, QuizService,
      ],
    });
  }));

  beforeEach(async(inject([QuizService], (service: QuizService) => {
    service.quiz = new QuizEntity({
      name: 'test',
      sessionConfig: new SessionConfigurationEntity(DefaultSettings.defaultQuizSettings.sessionConfig),
      questionList: [
        new SingleChoiceQuestionEntity({}),
      ],
    });
    service.isOwner = true;
  })));

  it('should be created', async(inject([QuizService], (service: QuizService) => {
    expect(service).toBeTruthy();
  })));

  it('#persist', async(inject([QuizService, StorageService], (service: QuizService) => {
    service.persist();
  })));

  it('#updateFooterElementsState', async(inject([QuizService, FooterBarService], (service: QuizService, footerBarService: FooterBarService) => {
    const defaultNickConfig = DefaultSettings.defaultQuizSettings.sessionConfig.nicks;
    footerBarService['updateFooterElementsState']();

    expect(footerBarService.footerElemEnableCasLogin.isActive).toEqual(defaultNickConfig.restrictToCasLogin);
    expect(footerBarService.footerElemBlockRudeNicknames.isActive).toEqual(defaultNickConfig.blockIllegalNicks);
  })));
});
