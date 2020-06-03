import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { HotkeysService } from 'angular2-hotkeys';
import { TOAST_CONFIG } from 'ngx-toastr';
import { of } from 'rxjs';
import { SwUpdateMock } from '../../../../../../_mocks/_services/SwUpdateMock';
import { TranslateServiceMock } from '../../../../../../_mocks/_services/TranslateServiceMock';
import { HeaderComponent } from '../../../../../header/header/header.component';
import { SurveyQuestionEntity } from '../../../../../lib/entities/question/SurveyQuestionEntity';
import { jwtOptionsFactory } from '../../../../../lib/jwt.factory';
import { LivePreviewComponent } from '../../../../../live-preview/live-preview/live-preview.component';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { ThemesMockService } from '../../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../../service/themes/themes.service';
import { TrackingMockService } from '../../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../../service/tracking/tracking.service';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';
import { AnsweroptionsDefaultComponent } from './answeroptions-default.component';

describe('AnsweroptionsDefaultComponent', () => {
  let component: AnsweroptionsDefaultComponent;
  let fixture: ComponentFixture<AnsweroptionsDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule,
        RouterTestingModule,
        NgbModalModule,
        AngularSvgIconModule.forRoot(),
        NgbPopoverModule,
        FontAwesomeModule,
        HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService,
        {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, HeaderLabelService, QuestionTextService, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
            queryParamMap: of({
              get: () => null,
            }),
          },
        }, {
          provide: SwUpdate,
          useClass: SwUpdateMock,
        }, {
          provide: TOAST_CONFIG,
          useValue: {
            default: {},
            config: {},
          },
        }, {
          provide: HotkeysService,
          useValue: {}
        }, {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
      ],
      declarations: [
        HeaderComponent, LivePreviewComponent, AnsweroptionsDefaultComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnsweroptionsDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', async(() => {
    expect(AnsweroptionsDefaultComponent.TYPE).toEqual('AnsweroptionsDefaultComponent');
  }));

  it('should add an answer', () => {
    component.addAnswer();
    expect(component.question.answerOptionList.length).toEqual(1);
    expect(component.question.answerOptionList[0].TYPE).toEqual('DefaultAnswerOption');
  });

  it('should delete an answer', () => {
    component.deleteAnswer(0);
    expect(component.question.answerOptionList.length).toEqual(0);
  });

  it('should update the answertext', () => {
    const value = 'newValue';
    const event = <any>{ target: { value } };
    component.addAnswer();
    component.updateAnswerValue(event, 0);
    expect(component.question.answerOptionList[0].answerText).toEqual(value);
  });

  it('should toggle the showOneAnswerPerRow option of the question', () => {
    const initValue = component.question.showOneAnswerPerRow;
    component.toggleShowOneAnswerPerRow();
    expect(component.question.showOneAnswerPerRow).not.toEqual(initValue);
  });

  it('should toggle the displayAnswerText option of the question', () => {
    const initValue = component.question.displayAnswerText;
    component.toggleShowAnswerContentOnButtons();
    expect(component.question.displayAnswerText).not.toEqual(initValue);
  });

  it('should toggle the multipleSelectionEnabled option of a survey question', () => {
    const initValue = (
      <SurveyQuestionEntity>component.question
    ).multipleSelectionEnabled;
    component.toggleMultipleSelectionSurvey();
    expect((
      <SurveyQuestionEntity>component.question
    ).multipleSelectionEnabled).not.toEqual(initValue);
  });
});
