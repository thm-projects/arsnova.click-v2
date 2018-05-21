import { async, inject, TestBed } from '@angular/core/testing';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
      ],
    });
  }));

  it('should be created', async(inject([WebsocketService], (service: WebsocketService) => {
    expect(service).toBeTruthy();
  })));
});
