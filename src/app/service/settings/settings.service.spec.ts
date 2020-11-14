import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SettingsService,
      ],
    });
  }));

  it('should be created', waitForAsync(inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  })));
});
