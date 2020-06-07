import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateParser,
  TranslateService,
  TranslateStore,
} from '@ngx-translate/core';
import { RxStompRPCService, RxStompService } from '@stomp/ng2-stompjs';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { jwtOptionsFactory } from '../../../../../lib/jwt.factory';
import { AttendeeMockService } from '../../../../../service/attendee/attendee.mock.service';
import { AttendeeService } from '../../../../../service/attendee/attendee.service';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { StorageService } from '../../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../../service/storage/storage.service.mock';
import { SharedModule } from '../../../../../shared/shared.module';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';

import { BonusTokenComponent } from './bonus-token.component';

describe('When BonusToken Icon is going to be clicked', () => {
  let component: BonusTokenComponent;
  let fixture: ComponentFixture<BonusTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule, I18nTestingModule, SharedModule, RouterTestingModule, JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID],
            }
          })
        ],
        declarations: [ BonusTokenComponent ],
        providers: [
          NgbActiveModal, JwtHelperService,
          TranslateStore, {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }, {
            provide: TranslateCompiler,
            useClass: TranslateFakeCompiler
          }, TranslateParser, RxStompRPCService, MarkdownService, {
            provide: MarkedOptions,
            useValue: {},
          }, RxStompService, {
            provide: StorageService,
            useClass: StorageServiceMock,
          }, TranslateService, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: QuizService,
            useClass: QuizMockService,
          }, SharedService, {
            provide: AttendeeService,
            useClass: AttendeeMockService,
          },
        ]
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should change value of the Copy-to-clipboard-Button after copying to clipboard', () => {
    component.copy();
    expect(component.clipboardText).toBeFalsy();
  });
});
