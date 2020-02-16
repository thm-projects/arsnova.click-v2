import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBold, faCode, faGlobe, faHeading, faImage, faItalic, faListUl, faStrikethrough } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { MarkdownBarComponent } from './markdown-bar.component';

describe('MarkdownBarComponent', () => {
  let component: MarkdownBarComponent;
  let fixture: ComponentFixture<MarkdownBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule,
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
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faBold);
    library.addIcons(faHeading);
    library.addIcons(faGlobe);
    library.addIcons(faListUl);
    library.addIcons(faCode);
    library.addIcons(faImage);
    library.addIcons(faStrikethrough);
    library.addIcons(faItalic);
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
