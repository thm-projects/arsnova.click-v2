import {async, inject, TestBed} from '@angular/core/testing';

import {ConnectionService} from './connection.service';
import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {SharedService} from './shared.service';
import {WebsocketService} from './websocket.service';
import {WebsocketMockService} from './websocket.mock.service';

describe('ConnectionService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule
      ],
      providers: [
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        ConnectionService
      ]
    });
  }));

  it('should be created', async(inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  })));
});
