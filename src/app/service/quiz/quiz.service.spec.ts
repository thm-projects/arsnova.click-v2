import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DefaultSettings } from '../../../lib/default.settings';
import { SingleChoiceQuestionEntity } from '../../../lib/entities/question/SingleChoiceQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
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
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService, TranslateService, FooterBarService, QuizService,
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
