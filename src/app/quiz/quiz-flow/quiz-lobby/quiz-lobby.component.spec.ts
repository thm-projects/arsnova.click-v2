import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
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
import { IndexedDbService } from '../../../service/storage/indexed.db.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TrackingMockService } from '../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';

import { QuizLobbyComponent } from './quiz-lobby.component';

describe('QuizLobbyComponent', () => {
  let component: QuizLobbyComponent;
  let fixture: ComponentFixture<QuizLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, HttpClientTestingModule, SharedModule, NgxQRCodeModule, NgbModule.forRoot(), TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        IndexedDbService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbModal, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: ActiveQuestionGroupService,
          useClass: ActiveQuestionGroupMockService,
        }, I18nService, HeaderLabelService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService,
        }, MemberApiService, QuizApiService,
      ],
      declarations: [QuizLobbyComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(QuizLobbyComponent.TYPE).toEqual('QuizLobbyComponent');
  }));

  it('#openKickMemberModal', inject([NgbModal], (modalService: NgbModal) => {
    const modalContent = '<div></div>';
    const nickToRemove = 'TestNick';

    spyOn(modalService, 'open').and.callFake(() => {});

    component.openKickMemberModal(modalContent, nickToRemove);

    expect(component['_kickMemberModalRef']).not.toBeNull();
  }));

  it('#kickMember', inject([NgbModal], (modalService: NgbModal) => {
    const modalContent = '<div></div>';
    const nickToRemove = 'TestNick';

    spyOn(modalService, 'open').and.callFake(() => {});
    spyOn(component, 'kickMember').and.callThrough();

    component.openKickMemberModal(modalContent, nickToRemove);
    (
      (
        async () => await component.kickMember(nickToRemove)
      )()
    );

    expect(component.kickMember).toHaveBeenCalled();
  }));

  it('#hexToRgb', () => {
    expect(component.hexToRgb('#ffffff')).toEqual({
      r: 255,
      g: 255,
      b: 255,
    });
    expect(component.hexToRgb('#000000')).toEqual({
      r: 0,
      g: 0,
      b: 0,
    });
  });

  it('#transformForegroundColor', () => {
    expect(component.transformForegroundColor({
      r: 0,
      g: 0,
      b: 0,
    })).toEqual('ffffff');
    expect(component.transformForegroundColor({
      r: 255,
      g: 255,
      b: 255,
    })).toEqual('000000');
  });

  it('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'sanitize').and.callFake(() => {});
    component.sanitizeHTML(markup);
    expect(sanitizer.sanitize).toHaveBeenCalled();
  }));

  it('#parseNickname', () => {
    const nicknameDefault = 'TestNickname';
    const nicknameEmoji = ':+1:';

    spyOn(component, 'sanitizeHTML').and.callFake(() => {});

    component.parseNickname(nicknameDefault);
    expect(component.sanitizeHTML).toHaveBeenCalledTimes(0);

    component.parseNickname(nicknameEmoji);

    expect(component.sanitizeHTML).toHaveBeenCalled();
  });
});
