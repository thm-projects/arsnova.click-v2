import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/TranslateServiceMock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { SharedModule } from '../../shared/shared.module';

import { MarkdownBarComponent } from './markdown-bar.component';

describe('MarkdownBarComponent', () => {
  let component: MarkdownBarComponent;
  let fixture: ComponentFixture<MarkdownBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule,
      ],
      providers: [
        {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [MarkdownBarComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarkdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', async(() => {
    expect(MarkdownBarComponent.TYPE).toEqual('MarkdownBarComponent');
  }));

  it('#connector', async(inject([TrackingService], (trackingService: TrackingService) => {
    const element = component.markdownBarElements.find(el => el.id === 'boldMarkdownButton');

    spyOn(component.connectorEmitter, 'emit').and.callFake(() => {});
    spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});

    component.connector(element);

    expect(trackingService.trackClickEvent).toHaveBeenCalled();
    expect(component.connectorEmitter.emit).toHaveBeenCalled();
  })));
});
