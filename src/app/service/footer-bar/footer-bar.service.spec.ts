import { async, inject, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SharedModule } from '../../shared/shared.module';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { TrackingMockService } from '../tracking/tracking.mock.service';
import { UserService } from '../user/user.service';

import { FooterBarService } from './footer-bar.service';

describe('FooterBarService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
      providers: [
        RxStompService, {
          provide: TranslateService,
          useClass: TrackingMockService,
        },
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, FooterBarService, {
          provide: UserService,
          useValue: {
            logout: () => {},
          },
        },
      ],
    });
  }));

  it('should be created', async(inject([FooterBarService], (service: FooterBarService) => {
    expect(service).toBeTruthy();
  })));
});
