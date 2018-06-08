import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { AttendeeMockService } from '../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { UserService } from '../../../service/user/user.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';

import { NicknameSelectComponent } from './nickname-select.component';

describe('NicknameSelectComponent', () => {
  let component: NicknameSelectComponent;
  let fixture: ComponentFixture<NicknameSelectComponent>;

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
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
        { provide: AttendeeService, useClass: AttendeeMockService },
        UserService,
      ],
      declarations: [NicknameSelectComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
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

      spyOn(router, 'navigate').and.callFake(() => {});

      component.joinQuiz(nickName);

      expect(component).toBeTruthy();
    }));
  });

  describe('#sanitizeHTML', () => {
    it('should sanitize a given html string', async(inject(
      [DomSanitizer], (sanitizer: DomSanitizer) => {
        const markup = '<div><span>TestMarkup</span></div>';

        spyOn(sanitizer, 'bypassSecurityTrustHtml').and.callFake(() => {});
        component.sanitizeHTML(markup);
        expect(sanitizer.bypassSecurityTrustHtml).toHaveBeenCalled();
      })),
    );
  });

  describe('#parseAvailableNick', () => {
    it('should sanitize and validate a given available nickname', () => {
      const nickName = 'testNick';

      const parsedNickname = component.parseAvailableNick(nickName);

      expect(parsedNickname).toEqual(nickName);
    });
  });
});
