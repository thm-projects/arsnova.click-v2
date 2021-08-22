import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HotkeysService } from 'angular2-hotkeys';
import { TOAST_CONFIG } from 'ngx-toastr';
import { of } from 'rxjs';
import { SwUpdateMock } from '../../../../../_mocks/_services/SwUpdateMock';
import { HeaderComponent } from '../../../../header/header/header.component';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { LivePreviewComponent } from '../../../../live-preview/live-preview/live-preview.component';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../service/themes/themes.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { TwitterService } from '../../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { AnsweroptionsDefaultComponent } from './answeroptions-default/answeroptions-default.component';
import { AnsweroptionsFreetextComponent } from './answeroptions-freetext/answeroptions-freetext.component';
import { AnsweroptionsRangedComponent } from './answeroptions-ranged/answeroptions-ranged.component';

import { AnsweroptionsComponent } from './answeroptions.component';

describe('AnsweroptionsComponent', () => {
  let component: AnsweroptionsComponent;
  let fixture: ComponentFixture<AnsweroptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        NgbModalModule,
        AngularSvgIconModule.forRoot(),
        NgbPopoverModule,
        FontAwesomeModule,
        JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, HeaderLabelService, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
            queryParamMap: of({
              get: () => 0,
            }),
          },
        }, SharedService, QuestionTextService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, I18nService, {
          provide: SwUpdate,
          useClass: SwUpdateMock,
        }, {
          provide: TOAST_CONFIG,
          useValue: {
            default: {},
            config: {},
          },
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {
            add: () => {},
            reset: () => {},
          }
        },
      ],
      declarations: [
        HeaderComponent,
        LivePreviewComponent,
        AnsweroptionsDefaultComponent,
        AnsweroptionsFreetextComponent,
        AnsweroptionsRangedComponent,
        AnsweroptionsComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AnsweroptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', waitForAsync(() => {
    expect(AnsweroptionsComponent.TYPE).toEqual('AnsweroptionsComponent');
  }));
});
