import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TOAST_CONFIG } from 'ngx-toastr';
import { SwUpdateMock } from '../../../_mocks/_services/SwUpdateMock';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { SharedService } from '../../service/shared/shared.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { UpdateCheckService } from '../../service/update-check/update-check.service';
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule, NgbModule, AngularSvgIconModule.forRoot(),
      ],
      providers: [
        HeaderLabelService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, SharedService, I18nService, {
          provide: SwUpdate,
          useClass: SwUpdateMock,
        }, {
          provide: TOAST_CONFIG,
          useValue: {
            default: {},
            config: {},
          },
        },
      ],
      declarations: [
        HeaderComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    const updateCheckService = TestBed.inject(UpdateCheckService);
    spyOn(updateCheckService, 'reloadPage').and.callFake(() => {});
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', waitForAsync(() => {
    expect(HeaderComponent.TYPE).toEqual('HeaderComponent');
  }));

  it('#openConnectionQualityModal', (
    inject([TrackingService, NgbModal, ConnectionService],
      (trackingService: TrackingService, modalService: NgbModal, connectionService: ConnectionService) => {
        const modalContent = 'testcontent' as unknown as TemplateRef<any>;

        spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});
        spyOn(modalService, 'open').and.callFake(() => (
          {} as NgbModalRef
        ));
        spyOn(connectionService, 'calculateRTT').and.callFake(() => {});

        component.openConnectionQualityModal(modalContent);

        expect(trackingService.trackClickEvent).toHaveBeenCalled();
        expect(modalService.open).toHaveBeenCalledWith(modalContent);
        expect(connectionService.calculateRTT).toHaveBeenCalled();
      })
  ));
});
