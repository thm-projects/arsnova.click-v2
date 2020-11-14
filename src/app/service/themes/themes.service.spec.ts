import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { TransferState } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { DefaultSettings } from '../../lib/default.settings';
import { MessageProtocol, StatusProtocol } from '../../lib/enums/Message';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { I18nService } from '../i18n/i18n.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { ThemesService } from './themes.service';

describe('ThemesService', () => {
  const themeUrl = `${DefaultSettings.httpApiEndpoint}/themes`;
  const themeData = {
    'status': StatusProtocol.Success,
    'step': MessageProtocol.GetThemes,
    'payload': [
      {
        'name': 'component.theme_switcher.themes.material.name',
        'description': 'component.theme_switcher.themes.material.description',
        'id': 'Material',
      },
    ],
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        I18nService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, FooterBarService, SettingsService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, SharedService, ThemesService, TransferState
      ],
    });
  }));

  afterEach(() => {
    const linkNodes = document.getElementsByClassName('theme-meta-data');
    while (linkNodes.length) {
      linkNodes.item(0).remove();
    }
  });

  it('should be created', (
    inject([ThemesService], (service: ThemesService) => {
      expect(service).toBeTruthy();
    })
  ));

  it('#updateCurrentlyUsedTheme', waitForAsync(inject([ThemesService, ConnectionService], (service: ThemesService, connectionService: ConnectionService) => {
    spyOnProperty(service, 'currentTheme').and.returnValue('Material');
    spyOn(service, 'reloadLinkNodes').and.callFake(() => of(null));
    spyOn(connectionService.dataEmitter, 'subscribe').and.callFake(() => of({ status: StatusProtocol.Failed }).subscribe());

    expect(document.getElementById('link-manifest')).toBe(null);
    expect(service.currentTheme).toEqual('Material');
    service.updateCurrentlyUsedTheme().then(() => {
      expect(service.reloadLinkNodes).toHaveBeenCalled();
    });
  })));

  it('#reloadLinkNodes', waitForAsync(inject([ThemesService], (service: ThemesService) => {

    spyOnProperty(service, 'currentTheme').and.returnValue('Material');
    spyOn(service, 'reloadLinkNodes').and.callThrough();

    service.reloadLinkNodes('theme-Material');
    expect(service.reloadLinkNodes).toHaveBeenCalled();
  })));
});
