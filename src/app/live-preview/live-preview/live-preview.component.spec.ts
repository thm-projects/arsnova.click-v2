import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TOAST_CONFIG } from 'ngx-toastr';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { SwUpdateMock } from '../../../_mocks/_services/SwUpdateMock';
import { HeaderModule } from '../../header/header.module';
import { DeviceType } from '../../lib/enums/DeviceType';
import { LivePreviewEnvironment } from '../../lib/enums/LivePreviewEnvironment';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { CustomMarkdownService } from '../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { QuestionTextService } from '../../service/question-text/question-text.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';

import { LivePreviewComponent } from './live-preview.component';

describe('LivePreviewComponent', () => {
  let component: LivePreviewComponent;
  let fixture: ComponentFixture<LivePreviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, RouterTestingModule, HttpClientTestingModule, HeaderModule, NgbModule, AngularSvgIconModule.forRoot(),
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, QuestionTextService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SharedService, SettingsService, HeaderLabelService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, I18nService, {
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
      declarations: [LivePreviewComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LivePreviewComponent);
    component = fixture.componentInstance;
    component.targetEnvironment = LivePreviewEnvironment.QUESTION;
    component.targetDevice = DeviceType.XS;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', waitForAsync(() => {
    expect(LivePreviewComponent.TYPE).toEqual('LivePreviewComponent');
  }));

  it('#deviceClass', waitForAsync(() => {
    component.targetDevice = DeviceType.XS;
    expect(component.deviceClass()).toEqual('device_xs');
  }));

  it('#getComputedWidth', waitForAsync(() => {
    component.targetDevice = DeviceType.XS;
    expect(component.getComputedWidth()).toEqual('calc(50% - 1rem)');
  }));

  it('#normalizeAnswerOptionIndex', waitForAsync(() => {
    expect(component.normalizeAnswerOptionIndex(0)).toEqual('A');
    expect(component.normalizeAnswerOptionIndex(1)).toEqual('B');
  }));

  it('#sanitizeHTML', waitForAsync(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>Test</span></div>';
    spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    component.sanitizeHTML(markup);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(markup);
  })));
});
