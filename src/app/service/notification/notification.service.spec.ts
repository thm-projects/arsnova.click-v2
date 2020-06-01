import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwPush } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { CustomMarkdownService } from '../custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../custom-markdown/CustomMarkdownServiceMock';
import { ThemesMockService } from '../themes/themes.mock.service';
import { ThemesService } from '../themes/themes.service';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule, I18nTestingModule, JwtModule.forRoot({
        jwtOptionsProvider: {
          provide: JWT_OPTIONS,
          useFactory: jwtOptionsFactory,
          deps: [PLATFORM_ID],
        },
      }),
    ],
    providers: [
      { provide: SwPush, useValue: {} },
      { provide: CustomMarkdownService, useClass: CustomMarkdownServiceMock },
      RxStompService, {
        provide: ThemesService,
        useClass: ThemesMockService
      }, SimpleMQ, {
        provide: HotkeysService,
        useValue: {}
      },
    ],
  }));

  it('should be created', () => {
    const service: NotificationService = TestBed.inject(NotificationService);
    expect(service).toBeTruthy();
  });
});
