import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID, SecurityContext } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { Language } from '../../../lib/enums/enums';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../service/header-label/header-label.service';
import { I18nService } from '../../../service/i18n/i18n.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { SharedModule } from '../../../shared/shared.module';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let i18nService: I18nService;
  let fixture: ComponentFixture<LeaderboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }), HttpClientTestingModule,
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, RxStompService, SimpleMQ, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbActiveModal, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, I18nService, HeaderLabelService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [LeaderboardComponent, ServerUnavailableModalComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    i18nService = TestBed.inject(I18nService);
    i18nService.currentLanguage = Language.DE;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', waitForAsync(() => {
    expect(LeaderboardComponent.TYPE).toEqual('LeaderboardComponent');
  }));

  it('#sanitizeHTML', waitForAsync(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'sanitize').and.callFake((context: SecurityContext, value: string) => value);
    component.sanitizeHTML(markup);
    expect(sanitizer.sanitize).toHaveBeenCalled();
  })));

  it('#parseNickname', waitForAsync(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const nicknameDefault = 'TestNickname';
    const nicknameEmoji = ':+1:';

    spyOn(component, 'sanitizeHTML').and.callFake((value: string) => value);

    component.parseNickname(nicknameDefault);
    expect(component.sanitizeHTML).toHaveBeenCalledTimes(0);

    component.parseNickname(nicknameEmoji);

    expect(component.sanitizeHTML).toHaveBeenCalled();
  })));

  it('#roundResponseTime', waitForAsync(() => {
    expect(component.roundResponseTime(10.52123123, 2)).toEqual(10.52);
    expect(component.roundResponseTime(10.2)).toEqual(10);
    expect(component.roundResponseTime(10.5)).toEqual(11);
    expect(component.roundResponseTime(<any>'asdf')).toEqual(NaN);
    expect(component.roundResponseTime(5, 5.5)).toEqual(NaN);
  }));

  it('#formatResponseTime', () => {
    spyOn(i18nService, 'formatNumber').and.callThrough();
    component.formatResponseTime(10.52123123);
    expect(i18nService.formatNumber).toHaveBeenCalled();
  });
});
