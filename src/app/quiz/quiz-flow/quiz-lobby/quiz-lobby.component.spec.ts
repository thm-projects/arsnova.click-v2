import { SecurityContext, TemplateRef } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslateServiceMock } from '../../../../_mocks/TranslateServiceMock';
import { ServerUnavailableModalComponent } from '../../../modals/server-unavailable-modal/server-unavailable-modal.component';
import { MemberApiService } from '../../../service/api/member/member-api.service';
import { QuizApiService } from '../../../service/api/quiz/quiz-api.service';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
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
import { UserService } from '../../../service/user/user.service';
import { SharedModule } from '../../../shared/shared.module';

import { QuizLobbyComponent } from './quiz-lobby.component';

describe('QuizLobbyComponent', () => {
  let component: QuizLobbyComponent;
  let fixture: ComponentFixture<QuizLobbyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, SharedModule, QRCodeModule, NgbModule,
      ],
      providers: [
        {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, NgbModal, {
          provide: TrackingService,
          useClass: TrackingMockService,
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
          provide: ThemesService,
          useClass: ThemesMockService,
        }, MemberApiService, QuizApiService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        }, {
          provide: UserService,
          useValue: {},
        }, SimpleMQ,
      ],
      declarations: [QuizLobbyComponent, ServerUnavailableModalComponent],
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ServerUnavailableModalComponent] } }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizLobbyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  xit('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(QuizLobbyComponent.TYPE).toEqual('QuizLobbyComponent');
  }));

  xit('#openKickMemberModal', inject([NgbModal], (modalService: NgbModal) => {
    const modalContent = '<div></div>' as unknown as TemplateRef<any>;
    const nickToRemove = 'TestNick';

    spyOn(modalService, 'open').and.callFake(() => ({} as NgbModalRef));

    component.openKickMemberModal(modalContent, nickToRemove);

    expect(component['_kickMemberModalRef']).not.toBeNull();
  }));

  it('#kickMember', inject([NgbModal], (modalService: NgbModal) => {
    const modalContent = '<div></div>' as unknown as TemplateRef<any>;
    const nickToRemove = 'TestNick';

    component['_ownsQuiz'] = true;
    spyOn(modalService, 'open').and.returnValue({ close: () => {} } as NgbModalRef);
    spyOn(component, 'kickMember').and.callThrough();

    component.openKickMemberModal(modalContent, nickToRemove);
    ((async () => await component.kickMember(nickToRemove))());

    expect(component.kickMember).toHaveBeenCalled();
  }));

  xit('#hexToRgb', () => {
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

  xit('#transformForegroundColor', () => {
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

  xit('#sanitizeHTML', inject([DomSanitizer], (sanitizer: DomSanitizer) => {
    const markup = '<div><span>TestMarkup</span></div>';

    spyOn(sanitizer, 'sanitize').and.callFake((context: SecurityContext, value: string) => value);
    component.sanitizeHTML(markup);
    expect(sanitizer.sanitize).toHaveBeenCalled();
  }));

  it('#parseNickname', () => {
    const nicknameDefault = 'TestNickname';
    const nicknameEmoji = ':+1:';

    spyOn(component, 'sanitizeHTML').and.callFake((value: string) => value as SafeHtml);

    component.parseNickname(nicknameDefault);
    expect(component.sanitizeHTML).toHaveBeenCalledTimes(0);

    component.parseNickname(nicknameEmoji);

    expect(component.sanitizeHTML).toHaveBeenCalled();
  });
});
