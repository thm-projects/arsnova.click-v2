import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusTokenComponent } from './bonus-token.component';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {JWT_OPTIONS, JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {jwtOptionsFactory} from '../../../../../lib/jwt.factory';
import {PLATFORM_ID} from '@angular/core';
import {
  TranslateCompiler,
  TranslateFakeCompiler,
  TranslateFakeLoader,
  TranslateLoader,
  TranslateParser, TranslatePipe,
  TranslateService,
  TranslateStore
} from '@ngx-translate/core';
import {TranslateServiceMock} from '../../../../../../_mocks/_services/TranslateServiceMock';
import {TranslatePipeMock} from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import {I18nTestingModule} from '../../../../../shared/testing/i18n-testing/i18n-testing.module';
import {SharedModule} from '../../../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {RxStompRPCService, RxStompService} from '@stomp/ng2-stompjs';
import {MarkdownService, MarkedOptions} from 'ngx-markdown';
import {StorageService} from '../../../../../service/storage/storage.service';
import {StorageServiceMock} from '../../../../../service/storage/storage.service.mock';
import {FooterBarService} from '../../../../../service/footer-bar/footer-bar.service';
import {SettingsService} from '../../../../../service/settings/settings.service';
import {ConnectionService} from '../../../../../service/connection/connection.service';
import {ConnectionMockService} from '../../../../../service/connection/connection.mock.service';
import {QuizService} from '../../../../../service/quiz/quiz.service';
import {QuizMockService} from '../../../../../service/quiz/quiz-mock.service';
import {SharedService} from '../../../../../service/shared/shared.service';
import {AttendeeService} from '../../../../../service/attendee/attendee.service';
import {AttendeeMockService} from '../../../../../service/attendee/attendee.mock.service';

describe('When BonusToken Icon is going to be clicked', () => {
    let component: BonusTokenComponent;
    let fixture: ComponentFixture<BonusTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          }
        })
      ],
      declarations: [ BonusTokenComponent ],
      providers: [
          NgbActiveModal, HttpClient, HttpHandler, JwtHelperService,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }, TranslateStore, {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }, {
          provide: TranslateCompiler,
          useClass: TranslateFakeCompiler
        }, TranslateParser, {
          provide: TranslatePipe,
          useClass: TranslatePipeMock
        }, RxStompRPCService, MarkdownService, {
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
