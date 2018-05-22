import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { DefaultAnswerOption } from 'arsnova-click-v2-types/src/answeroptions/answeroption_default';
import { IQuestionSurvey } from 'arsnova-click-v2-types/src/questions/interfaces';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../../lib/translation.factory';
import { HeaderComponent } from '../../../../../header/header/header.component';
import { LivePreviewComponent } from '../../../../../live-preview/live-preview/live-preview.component';
import { ActiveQuestionGroupMockService } from '../../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuestionTextService } from '../../../../../service/question-text/question-text.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { TrackingMockService } from '../../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../../service/tracking/tracking.service';
import { WebsocketMockService } from '../../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../../service/websocket/websocket.service';

import { AnsweroptionsDefaultComponent } from './answeroptions-default.component';

class MockRouterSC {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0,
      });
    },
  };
}

class MockRouterSurvey {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 3,
      });
    },
  };
}

const imports = [
  RouterTestingModule,
  HttpClientModule,
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
  NgbModalModule.forRoot(),
];

const providers: Array<any> = [
  { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
  FooterBarService,
  SettingsService,
  { provide: ConnectionService, useClass: ConnectionMockService },
  { provide: WebsocketService, useClass: WebsocketMockService },
  SharedService,
  HeaderLabelService,
  QuestionTextService,
  { provide: TrackingService, useClass: TrackingMockService },
];

const declarations = [
  HeaderComponent,
  LivePreviewComponent,
  AnsweroptionsDefaultComponent,
];

describe('AnsweroptionsDefaultComponent', () => {

  describe('SingleChoiceQuestion', () => {
    let component: AnsweroptionsDefaultComponent;
    let fixture: ComponentFixture<AnsweroptionsDefaultComponent>;

    beforeEach((() => {
      providers.push({ provide: ActivatedRoute, useClass: MockRouterSC });

      TestBed.configureTestingModule({ imports, providers, declarations }).compileComponents();
    }));

    beforeEach((() => {
      fixture = TestBed.createComponent(AnsweroptionsDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    it('should be created', (() => {
      expect(component).toBeTruthy();
    }));
    it('should contain a TYPE reference', (() => {
      expect(AnsweroptionsDefaultComponent.TYPE).toEqual('AnsweroptionsDefaultComponent');
    }));

    describe('#addAnswer', () => {
      it('should add an answer', () => {
        component.addAnswer();
        expect(component.question.answerOptionList.length).toEqual(1);
        expect(component.question.answerOptionList[0].TYPE).toEqual('DefaultAnswerOption');
      });
    });

    describe('#deleteAnswer', () => {
      it('should delete an answer', () => {
        component.deleteAnswer(0);
        expect(component.question.answerOptionList.length).toEqual(0);
      });
    });

    describe('#updateAnswerValue', () => {
      it('should update the answertext', () => {
        const value = 'newValue';
        const event = <any>{ target: { value } };
        component.addAnswer();
        component.updateAnswerValue(event, 0);
        expect(component.question.answerOptionList[0].answerText).toEqual(value);
      });
    });

    describe('#toggleShowOneAnswerPerRow', () => {
      it('should toggle the showOneAnswerPerRow option of the question', () => {
        const initValue = component.question.showOneAnswerPerRow;
        component.toggleShowOneAnswerPerRow();
        expect(component.question.showOneAnswerPerRow).not.toEqual(initValue);
      });
    });

    describe('#toggleShowAnswerContentOnButtons', () => {
      it('should toggle the displayAnswerText option of the question', () => {
        const initValue = component.question.displayAnswerText;
        component.toggleShowAnswerContentOnButtons();
        expect(component.question.displayAnswerText).not.toEqual(initValue);
      });
    });
  });

  describe('SurveyQuestion', () => {
    let component: AnsweroptionsDefaultComponent;
    let fixture: ComponentFixture<AnsweroptionsDefaultComponent>;

    beforeEach((() => {
      providers.push({ provide: ActivatedRoute, useClass: MockRouterSurvey });

      TestBed.configureTestingModule({ imports, providers, declarations }).compileComponents();
    }));

    beforeEach((() => {
      fixture = TestBed.createComponent(AnsweroptionsDefaultComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }));

    describe('#toggleMultipleSelectionSurvey', () => {

      it('should toggle the multipleSelectionEnabled option of a survey question', () => {
        const initValue = (<IQuestionSurvey>component.question).multipleSelectionEnabled;
        component.toggleMultipleSelectionSurvey();
        expect((<IQuestionSurvey>component.question).multipleSelectionEnabled).not.toEqual(initValue);
      });
    });
  });
});
