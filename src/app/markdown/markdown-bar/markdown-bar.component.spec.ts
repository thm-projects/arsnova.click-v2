import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faBold,
  faCode,
  faGlobe,
  faHeading,
  faImage,
  faInfoCircle,
  faItalic,
  faListOl,
  faListUl,
  faMinus,
  faQuoteRight,
  faSlash,
  faStrikethrough,
} from '@fortawesome/free-solid-svg-icons';
import { MarkdownFeature } from '../../lib/enums/MarkdownFeature';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { MarkdownBarComponent } from './markdown-bar.component';

describe('MarkdownBarComponent', () => {
  let component: MarkdownBarComponent;
  let fixture: ComponentFixture<MarkdownBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule,
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

  beforeEach(waitForAsync(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faBold);
    library.addIcons(faHeading);
    library.addIcons(faGlobe);
    library.addIcons(faListUl);
    library.addIcons(faListOl);
    library.addIcons(faCode);
    library.addIcons(faImage);
    library.addIcons(faStrikethrough);
    library.addIcons(faItalic);
    library.addIcons(faSlash);
    library.addIcons(faMinus);
    library.addIcons(faInfoCircle);
    library.addIcons(faQuoteRight);
    fixture = TestBed.createComponent(MarkdownBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should have a TYPE reference', waitForAsync(() => {
    expect(MarkdownBarComponent.TYPE).toEqual('MarkdownBarComponent');
  }));

  it('#connector', waitForAsync(inject([TrackingService], (trackingService: TrackingService) => {
    const element = component.markdownBarElements.find(el => el.feature === MarkdownFeature.Bold);

    spyOn(component.connectorEmitter, 'emit').and.callFake(() => {});
    spyOn(trackingService, 'trackClickEvent').and.callFake(() => {});

    component.connector(element);

    expect(trackingService.trackClickEvent).toHaveBeenCalled();
    expect(component.connectorEmitter.emit).toHaveBeenCalled();
  })));
});
