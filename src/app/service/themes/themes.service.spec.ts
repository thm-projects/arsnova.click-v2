import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { of } from 'rxjs/index';
import { DefaultSettings } from '../../../lib/default.settings';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { CurrentQuizMockService } from '../current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../current-quiz/current-quiz.service';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SettingsService } from '../settings/settings.service';
import { SharedService } from '../shared/shared.service';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { ThemesService } from './themes.service';

describe('ThemesService', () => {
  let backend: HttpTestingController;

  const themeUrl = `${DefaultSettings.httpApiEndpoint}/themes`;
  const themeData = {
    'status': 'STATUS:SUCCESSFUL',
    'step': 'GET_THEMES',
    'payload':
      [
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
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
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
        { provide: ConnectionService, useClass: ConnectionMockService },
        TranslateService,
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        ThemesService,
      ],
    });
  }));

  beforeEach(async(() => {
    backend = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    backend.verify();
    const linkNodes = document.getElementsByClassName('theme-meta-data');
    while (linkNodes.length) {
      linkNodes.item(0).remove();
    }
  });

  it('should be created', (inject([ThemesService], (service: ThemesService) => {

    const themeDataReq = backend.expectOne(themeUrl);
    themeDataReq.flush(themeData);

    expect(service).toBeTruthy();
  })));

  it('#updateCurrentlyUsedTheme', async(inject(
    [ThemesService, ConnectionService], (service: ThemesService, connectionService: ConnectionService) => {
      spyOnProperty(service, 'currentTheme').and.returnValue('theme-Material');
      spyOn(service, 'reloadLinkNodes').and.callFake(() => of(null));
      spyOn(connectionService.socket, 'subscribe').and.callFake(() => ({ status: 'STATUS:FAILED' }));

      const themeDataReq = backend.expectOne(themeUrl);
      themeDataReq.flush(themeData);

      expect(document.getElementById('link-manifest')).toBe(null);
      expect(service.currentTheme).toEqual('theme-Material');
      service.updateCurrentlyUsedTheme().subscribe(() => {
        expect(service.reloadLinkNodes).toHaveBeenCalled();
      });
    })));

  xit('#reloadLinkNodes', async(inject([ThemesService],
    (service: ThemesService) => {

      const linkNodesUrl = `${DefaultSettings.httpLibEndpoint}/linkImages/theme-Material`;
      const linkNodes = [
        {
          'tagName': 'link',
          'className': 'theme-meta-data',
          'rel': 'manifest',
          'id': 'link-manifest',
          'href': `${DefaultSettings.httpLibEndpoint}/manifest/theme-Material`,
          'type': 'image/png',
        }, {
          'tagName': 'link',
          'className': 'theme-meta-data',
          'rel': 'apple-touch-icon',
          'id': 'link-apple-touch-default',
          'href': `${DefaultSettings.httpApiEndpoint}/files/images/theme/theme-Material/logo_s32x32.png`,
          'type': 'image/png',
        },
      ];

      spyOnProperty(service, 'currentTheme').and.returnValue('theme-Material');
      spyOn(service, 'reloadLinkNodes').and.callThrough();

      service.reloadLinkNodes('theme-Material').subscribe((result) => {
        backend.expectOne(linkNodesUrl).flush(linkNodes);
        backend.expectOne(themeUrl).flush(themeData);
        expect(service.reloadLinkNodes).toHaveBeenCalled();
      });
    })));
});
