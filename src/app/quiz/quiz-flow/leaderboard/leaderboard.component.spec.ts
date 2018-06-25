import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';

import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
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
      declarations: [LeaderboardComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
      expect(component).toBeTruthy();
    }),
  );

  it('should contain a TYPE reference', async(() => {
      expect(LeaderboardComponent.TYPE).toEqual('LeaderboardComponent');
    }),
  );

  it('#sanitizeHTML', async(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const markup = '<div><span>TestMarkup</span></div>';

      spyOn(sanitizer, 'sanitize').and.callFake(() => {});
      component.sanitizeHTML(markup);
      expect(sanitizer.sanitize).toHaveBeenCalled();
    })),
  );

  it('#parseNickname', async(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const nicknameDefault = 'TestNickname';
      const nicknameEmoji = ':+1:';

      spyOn(component, 'sanitizeHTML').and.callFake(() => {});

      component.parseNickname(nicknameDefault);
      expect(component.sanitizeHTML).toHaveBeenCalledTimes(0);

      component.parseNickname(nicknameEmoji);

      expect(component.sanitizeHTML).toHaveBeenCalled();
    })),
  );

  it('#roundResponseTime', async(() => {
      expect(component.roundResponseTime(10.52123123, 2)).toEqual(10.52);
      expect(component.roundResponseTime(10.2)).toEqual(10);
      expect(component.roundResponseTime(10.5)).toEqual(11);
      expect(component.roundResponseTime(<any>'asdf')).toEqual(NaN);
      expect(component.roundResponseTime(5, 5.5)).toEqual(NaN);
    }),
  );

  it('#formatResponseTime', async(inject([I18nService], (i18nService: I18nService) => {
      spyOn(i18nService, 'formatNumber').and.callThrough();
      expect(component.formatResponseTime(10.52123123)).toEqual(component.roundResponseTime(10.52123123, 2).toLocaleString());
      expect(component.formatResponseTime(10.2)).toEqual(10.2.toLocaleString());
      expect(component.formatResponseTime(10.5)).toEqual(10.5.toLocaleString());
      expect(i18nService.formatNumber).toHaveBeenCalled();
    })),
  );
});