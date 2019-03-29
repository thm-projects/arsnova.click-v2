import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { of } from 'rxjs';
import { DefaultSettings } from '../../../lib/default.settings';
import { MessageProtocol, StatusProtocol } from '../../../lib/enums/Message';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { I18nService } from '../i18n/i18n.service';
import { QuizMockService } from '../quiz/quiz-mock.service';
import { QuizService } from '../quiz/quiz.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { IndexedDbService } from '../storage/indexed.db.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

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
        'id': 'theme-Material',
      },
    ],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        I18nService, IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, TranslateService, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, ThemesService,
      ],
    });
  }));

  afterEach(() => {
    const linkNodes = document.getElementsByClassName('theme-meta-data');
    while (linkNodes.length) {
      linkNodes.item(0).remove();
    }
  });

  it('should be created', (inject([ThemesService], (service: ThemesService) => {
    expect(service).toBeTruthy();
  })));

  it('#updateCurrentlyUsedTheme', async(inject([ThemesService, ConnectionService], (service: ThemesService, connectionService: ConnectionService) => {
    spyOnProperty(service, 'currentTheme').and.returnValue('theme-Material');
    spyOn(service, 'reloadLinkNodes').and.callFake(() => of(null));
    spyOn(connectionService.dataEmitter, 'subscribe').and.callFake(() => of({ status: StatusProtocol.Failed }).subscribe());

    expect(document.getElementById('link-manifest')).toBe(null);
    expect(service.currentTheme).toEqual('theme-Material');
    service.updateCurrentlyUsedTheme().then(() => {
      expect(service.reloadLinkNodes).toHaveBeenCalled();
    });
  })));

  it('#reloadLinkNodes', async(inject([ThemesService], (service: ThemesService) => {

    spyOnProperty(service, 'currentTheme').and.returnValue('theme-Material');
    spyOn(service, 'reloadLinkNodes').and.callThrough();

    service.reloadLinkNodes('theme-Material');
    expect(service.reloadLinkNodes).toHaveBeenCalled();
  })));
});
