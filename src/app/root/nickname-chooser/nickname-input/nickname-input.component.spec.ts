import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, inject, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TwitterService } from '../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../service/twitter/twitter.service.mock';
import { UserService } from '../../../service/user/user.service';
import { SharedModule } from '../../../shared/shared.module';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';

import { NicknameInputComponent } from './nickname-input.component';

describe('NicknameInputComponent', () => {
  let component: NicknameInputComponent;
  let fixture: ComponentFixture<NicknameInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }), RouterTestingModule, HttpClientTestingModule, FontAwesomeModule, SharedModule,
      ],
      providers: [
        RxStompService, {
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
        }, SimpleMQ, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [NicknameInputComponent],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(NicknameInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', waitForAsync(() => {
    expect(NicknameInputComponent.TYPE).toEqual('NicknameInputComponent');
  }));

  describe('#joinQuiz', () => {

    it('should join the quiz', waitForAsync(inject([Router], (router: Router) => {
      spyOn(router, 'navigate').and.callFake(() => new Promise<boolean>(resolve => {resolve(); }));

      component.joinQuiz();

      expect(component.failedLoginReason).toEqual('');
    })));
  });
});
