import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModalModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { TOAST_CONFIG } from 'ngx-toastr';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { SwUpdateMock } from '../../../../../../_mocks/_services/SwUpdateMock';
import { HeaderComponent } from '../../../../../header/header/header.component';
import { SurveyQuestionEntity } from '../../../../../lib/entities/question/SurveyQuestionEntity';
import { LivePreviewComponent } from '../../../../../live-preview/live-preview/live-preview.component';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { I18nService } from '../../../../../service/i18n/i18n.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
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
        I18nTestingModule, RouterTestingModule, NgbModalModule, AngularSvgIconModule, NgbPopoverModule, FontAwesomeModule, HttpClientTestingModule,
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, {
          provide: QuizService,
          useClass: QuizMockService,
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
          },
        }, I18nService, {
          provide: SwUpdate,
          useClass: SwUpdateMock,
        }, {
          provide: TOAST_CONFIG,
          useValue: {
            default: {},
            config: {},
          },
        },
      ],
      declarations: [
        HeaderComponent, LivePreviewComponent, AnsweroptionsDefaultComponent, TranslatePipeMock,
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
