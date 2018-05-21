import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ConnectionMockService } from '../connection/connection.mock.service';
import { ConnectionService } from '../connection/connection.service';
import { SharedService } from '../shared/shared.service';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        SharedService,
        { provide: WebsocketService, useClass: WebsocketMockService },
        { provide: ConnectionService, useClass: ConnectionMockService },
        SettingsService,
      ],
    });
  }));

  it('should be created', async(inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  })));
});
