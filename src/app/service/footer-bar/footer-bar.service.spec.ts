import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { SharedModule } from '../../shared/shared.module';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { ThemesMockService } from '../themes/themes.mock.service';
import { ThemesService } from '../themes/themes.service';
import { TrackingMockService } from '../tracking/tracking.mock.service';
import { TwitterService } from '../twitter/twitter.service';
import { TwitterServiceMock } from '../twitter/twitter.service.mock';
import { UserService } from '../user/user.service';

import { FooterBarService } from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, SharedModule, HttpClientTestingModule,
      ],
      providers: [
        RxStompService, SimpleMQ, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, {
          provide: TranslateService,
          useClass: TrackingMockService,
        }, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, {
          provide: UserService,
          useValue: {
            logout: () => {},
          },
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        }
      ],
    });
  }));

  it('should be created', async(inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  })));
});
