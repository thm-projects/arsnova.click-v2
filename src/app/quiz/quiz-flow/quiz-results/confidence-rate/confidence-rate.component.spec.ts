import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { AttendeeMockService } from '../../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';

import { ConfidenceRateComponent } from './confidence-rate.component';

describe('QuizResults: ConfidenceRateComponent', () => {
  let component: ConfidenceRateComponent;
  let fixture: ComponentFixture<ConfidenceRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
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
        NgbActiveModal,
        { provide: TrackingService, useClass: TrackingMockService },
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        I18nService,
        HeaderLabelService,
        { provide: AttendeeService, useClass: AttendeeMockService },
      ],
      declarations: [ConfidenceRateComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfidenceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(ConfidenceRateComponent.TYPE).toEqual('ConfidenceRateComponent');
  }));

  it('#sanitizeStyle', async(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    expect(component.sanitizeStyle('20%')).toBeTruthy();
  })));
});
