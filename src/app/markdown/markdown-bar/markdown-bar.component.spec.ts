import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../lib/translation.factory';
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
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        {
          provide: TrackingService,
          useClass: TrackingMockService,
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
    const element = component.markdownBarElements.find(el => el.id === 'showMoreMarkdownButton');

    spyOn(component.connectorEmitter, 'emit').and.callFake(() => {});
    spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});

    expect(component.showHiddenMarkdownButtons).toBeFalsy();

    component.connector(element);

    expect(component.showHiddenMarkdownButtons).toBeTruthy();
    expect(component.allDisplayedMarkdownBarElements)
    .toEqual(jasmine.arrayContaining([].concat(component.markdownBarElements).concat(component.hiddenMarkdownBarElements)));
    expect(trackingService.trackClickEvent).toHaveBeenCalled();
    expect(component.connectorEmitter.emit).toHaveBeenCalled();
  })));
});
