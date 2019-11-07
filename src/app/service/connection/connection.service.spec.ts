import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RxStompService } from '@stomp/ng2-stompjs';
import { FooterBarService } from '../footer-bar/footer-bar.service';
import { SharedService } from '../shared/shared.service';
import { StorageService } from '../storage/storage.service';
import { StorageServiceMock } from '../storage/storage.service.mock';
import { ConnectionService } from './connection.service';

describe('ConnectionService', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, SharedService, FooterBarService, ConnectionService, RxStompService,
      ],
    });
  }));

  it('should be created', async(inject([ConnectionService], (service: ConnectionService) => {
    expect(service).toBeTruthy();
  })));
});
