import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { SharedService } from '../../service/shared/shared.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../service/websocket/websocket.service';
import { SharedModule } from '../../shared/shared.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, NgbModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        HeaderLabelService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, SharedService, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        },
      ],
      declarations: [
        HeaderComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(HeaderComponent.TYPE).toEqual('HeaderComponent');
  }));

  it('#openConnectionQualityModal', (inject([TrackingService, NgbModal, ConnectionService],
    (trackingService: TrackingService, modalService: NgbModal, connectionService: ConnectionService) => {
      const modalContent = 'testcontent';

      spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
      spyOn(modalService, 'open').and.callFake(() => {});
      spyOn(connectionService, 'calculateRTT').and.callFake(() => {});

      component.openConnectionQualityModal(modalContent);

      expect(trackingService.trackClickEvent).toHaveBeenCalled();
      expect(modalService.open).toHaveBeenCalledWith(modalContent);
      expect(connectionService.calculateRTT).toHaveBeenCalled();
    })));
});
