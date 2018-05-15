import {async, inject, TestBed} from '@angular/core/testing';

import {SettingsService} from './settings.service';
import {ConnectionService} from './connection.service';
import {WebsocketService} from './websocket.service';
import {SharedService} from './shared.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {WebsocketMockService} from './websocket.mock.service';
import {ConnectionMockService} from './connection.mock.service';

describe('SettingsService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
      ],
      providers: [
        SharedService,
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ConnectionService, useClass: ConnectionMockService},
        SettingsService
      ]
    });
  }));

  it('should be created', async(inject([SettingsService], (service: SettingsService) => {
    expect(service).toBeTruthy();
  })));
});
