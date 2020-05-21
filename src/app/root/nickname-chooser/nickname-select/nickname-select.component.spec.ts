import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID, SecurityContext } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { UserService } from '../../../service/user/user.service';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { NicknameSelectComponent } from './nickname-select.component';

describe('NicknameSelectComponent', () => {
  let component: NicknameSelectComponent;
  let fixture: ComponentFixture<NicknameSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), I18nTestingModule, RouterTestingModule, HttpClientTestingModule, FontAwesomeModule, NgbAlertModule,
      ],
      providers: [
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: AttendeeService,
          useClass: AttendeeMockService,
        }, {
          provide: UserService,
          useValue: {},
        }, SimpleMQ,
      ],
      declarations: [NicknameSelectComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faSpinner);
    fixture = TestBed.createComponent(NicknameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a TYPE reference', () => {
    expect(NicknameSelectComponent.TYPE).toEqual('NicknameSelectComponent');
  });

  describe('#joinQuiz', () => {
    it('should join a quiz', inject([Router], (router: Router) => {
      const nickName = 'testNick';

      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.joinQuiz(nickName);

      expect(component).toBeTruthy();
    }));
  });

  describe('#sanitizeHTML', () => {
    it('should sanitize a given html string', async(inject([DomSanitizer], (sanitizer: DomSanitizer) => {
      const markup = '<div><span>TestMarkup</span></div>';

      spyOn(sanitizer, 'sanitize').and.callFake((ctx: SecurityContext, value: string) => value as string);
      component.sanitizeHTML(markup);
      expect(sanitizer.sanitize).toHaveBeenCalled();
    })));
  });

  describe('#parseAvailableNick', () => {
    it('should sanitize and validate a given available nickname', () => {
      const nickName = 'testNick';

      const parsedNickname = component.parseAvailableNick(nickName);

      expect(parsedNickname).toEqual(nickName);
    });
  });
});
