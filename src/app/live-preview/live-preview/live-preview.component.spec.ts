import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT } from '../../../environments/environment';
import { createTranslateLoader } from '../../../lib/translation.factory';
import { HeaderModule } from '../../header/header.module';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { QuestionTextService } from '../../service/question-text/question-text.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';

import { LivePreviewComponent } from './live-preview.component';

describe('LivePreviewComponent', () => {
  let component: LivePreviewComponent;
  let fixture: ComponentFixture<LivePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, HttpClientTestingModule, HeaderModule, NgbModule, TranslateModule.forRoot({
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
        QuestionTextService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, FooterBarService, SharedService, SettingsService, HeaderLabelService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        },
      ],
      declarations: [LivePreviewComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LivePreviewComponent);
    component = fixture.componentInstance;
    component.targetEnvironment = LIVE_PREVIEW_ENVIRONMENT.QUESTION;
    component.targetDevice = DEVICE_TYPES.XS;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(LivePreviewComponent.TYPE).toEqual('LivePreviewComponent');
  }));

  it('#deviceClass', async(() => {
    component.targetDevice = DEVICE_TYPES.XS;
    expect(component.deviceClass()).toEqual('device_xs');
  }));

  it('#getComputedWidth', async(() => {
    component.targetDevice = DEVICE_TYPES.XS;
    expect(component.getComputedWidth()).toEqual('calc(50% - 1rem)');
  }));

  it('#normalizeAnswerOptionIndex', async(() => {
    expect(component.normalizeAnswerOptionIndex(0)).toEqual('A');
    expect(component.normalizeAnswerOptionIndex(1)).toEqual('B');
  }));

  it('#sanitizeHTML', async(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>Test</span></div>';
    spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callThrough();
    component.sanitizeHTML(markup);
    expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalledWith(markup);
  })));
});
