import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IFreetextAnswerOption } from 'arsnova-click-v2-types/dist/answeroptions/interfaces';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../../../lib/translation.factory';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { WebsocketMockService } from '../../../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../../../service/websocket/websocket.service';

import { AnsweroptionsFreetextComponent } from './answeroptions-freetext.component';

class MockRouter {
  public params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 1,
      });
    },
  };
}

describe('AnsweroptionsFreetextComponent', () => {
  let component: AnsweroptionsFreetextComponent;
  let fixture: ComponentFixture<AnsweroptionsFreetextComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
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
        {
          provide: QuizService,
          useClass: QuizMockService,
        }, HeaderLabelService, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: ActivatedRoute,
          useClass: MockRouter,
        },
      ],
      declarations: [AnsweroptionsFreetextComponent],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(AnsweroptionsFreetextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE reference', (() => {
    expect(AnsweroptionsFreetextComponent.TYPE).toEqual('AnsweroptionsFreetextComponent');
  }));

  describe('#setTestInput', () => {
    it('should add a test input', () => {
      const value = 'Testinputvalue';
      const event = <any>{ target: { value } };
      component.setTestInput(event);
      expect(component.testInput).toEqual(value);
    });
  });

  describe('#setMatchText', () => {
    it('should add a match text to the answer text', () => {
      const value = 'Testinputvalue';
      const event = <any>{ target: { value } };
      component.setMatchText(event);
      expect(component.question.answerOptionList[0].answerText).toEqual(value);
    });
  });

  describe('#hasTestInput', () => {
    it('should return true if a testinput has been set', () => {
      const value = 'Testinputvalue';
      const event = <any>{ target: { value } };
      component.setTestInput(event);
      expect(component.hasTestInput()).toBeTruthy();
    });
    it('should return false if no testinput has been set', () => {
      const value = '';
      const event = <any>{ target: { value } };
      component.setTestInput(event);
      expect(component.hasTestInput()).toBeFalsy();
    });
  });

  describe('#isTestInputCorrect', () => {
    it('should return true if the testinput matches the answer text', () => {
      const value = 'Testvalue';
      const event = <any>{ target: { value } };
      component.setTestInput(event);
      component.setMatchText(event);
      expect(component.isTestInputCorrect()).toBeTruthy();
    });
    it('should return false if the testinput does not match the answer text', () => {
      const testinput = <any>{ target: { value: 'Testinputvalue' } };
      const testmatch = <any>{ target: { value: 'Testmatchvalue' } };
      component.setTestInput(testinput);
      component.setMatchText(testmatch);
      expect(component.isTestInputCorrect()).toBeFalsy();
    });
  });

  describe('#setConfig', () => {
    it('should set a validation configuration of the question', () => {
      const initValue = (<IFreetextAnswerOption>component.question.answerOptionList[0]).getConfig()[0];
      component.setConfig(initValue.id, !initValue.enabled);
      const newValue = (<IFreetextAnswerOption>component.question.answerOptionList[0]).getConfig()[0];
      expect(newValue.id).toEqual(initValue.id);
      expect(newValue.enabled).not.toEqual(initValue.enabled);
    });

    it('should throw an error if an invalid config is set', () => {
      expect(() => component.setConfig('NotExisting', true)).toThrowError('Config not found');
    });
  });
});
