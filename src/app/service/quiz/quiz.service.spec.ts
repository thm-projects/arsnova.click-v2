import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultSettings } from '../../../lib/default.settings';
import { SingleChoiceQuestionEntity } from '../../../lib/entities/question/SingleChoiceQuestionEntity';
import { QuizEntity } from '../../../lib/entities/QuizEntity';
import { SessionConfigurationEntity } from '../../../lib/entities/session-configuration/SessionConfigurationEntity';
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
        HttpClientTestingModule, RouterTestingModule,
      ],
      providers: [
        IndexedDbService, {
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

  xit('should be created', async(inject([QuizService], (service: QuizService) => {
    expect(service).toBeTruthy();
  })));

  xit('#persist', async(inject([QuizService, StorageService], (service: QuizService, storageService: StorageService) => {
    service.persist();
    storageService.getAllQuiznames().then(quiznames => {
      expect(quiznames).toContain('test');
    });
  })));

  xit('#updateFooterElementsState', async(inject([QuizService, FooterBarService], (service: QuizService, footerBarService: FooterBarService) => {
    const defaultNickConfig = DefaultSettings.defaultQuizSettings.sessionConfig.nicks;
    service.updateFooterElementsState();

    expect(footerBarService.footerElemEnableCasLogin.isActive).toEqual(defaultNickConfig.restrictToCasLogin);
    expect(footerBarService.footerElemBlockRudeNicknames.isActive).toEqual(defaultNickConfig.blockIllegalNicks);
  })));
});
