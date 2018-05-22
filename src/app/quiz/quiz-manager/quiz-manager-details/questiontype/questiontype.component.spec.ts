import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { WebsocketMockService } from '../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../service/websocket/websocket.service';

import { QuestiontypeComponent } from './questiontype.component';

class MockRouter {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0,
      });
    },
  };
}

describe('QuestiontypeComponent', () => {
  let component: QuestiontypeComponent;
  let fixture: ComponentFixture<QuestiontypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
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
      ],
      providers: [
        HeaderLabelService,
        { provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        { provide: ActivatedRoute, useClass: MockRouter },
        SharedService,
      ],
      declarations: [QuestiontypeComponent],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuestiontypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', async(() => {
    expect(QuestiontypeComponent.TYPE).toEqual('QuestiontypeComponent');
  }));

  describe('#isActiveQuestionType', () => {
    it('should return true if the current question type matches the input', () => {
      expect(component.isActiveQuestionType('SingleChoiceQuestion')).toBeTruthy();
    });
    it('should return false if the current question type does not match the input', () => {
      expect(component.isActiveQuestionType('SurveyQuestion')).toBeFalsy();
    });
  });

  describe('#morphToQuestionType', () => {
    it('should convert the current question type to a new one', inject(
      [ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const targetType = 'MultipleChoiceQuestion';
        component.morphToQuestionType(targetType);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0].TYPE).toEqual(targetType);
      }));
    it('should not convert the current question type if the passed type does not exist', inject(
      [ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
        const targetType = 'NotExistingType';
        const initType = activeQuestionGroupService.activeQuestionGroup.questionList[0].TYPE;
        component.morphToQuestionType(targetType);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0].TYPE).not.toEqual(targetType);
        expect(activeQuestionGroupService.activeQuestionGroup.questionList[0].TYPE).toEqual(initType);
      }));
  });
});
