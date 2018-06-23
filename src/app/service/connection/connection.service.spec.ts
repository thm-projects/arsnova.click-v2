import { HttpClientModule } from '@angular/common/http';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../shared/shared.module';
import { SharedService } from '../shared/shared.service';
import { WebsocketMockService } from '../websocket/websocket.mock.service';
import { WebsocketService } from '../websocket/websocket.service';

import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule,
      ],
      providers: [
        {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, ConnectionService,
      ],
    });
  }));

  it('should be created', async(inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  })));
});
