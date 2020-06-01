import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
import { FreeTextAnswerEntity } from '../../../../../lib/entities/answer/FreetextAnwerEntity';
import { jwtOptionsFactory } from '../../../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../../service/connection/connection.service';
import { CustomMarkdownService } from '../../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { FooterBarService } from '../../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../../service/settings/settings.service';
import { SharedService } from '../../../../../service/shared/shared.service';
import { ThemesMockService } from '../../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../../service/themes/themes.service';
import { I18nTestingModule } from '../../../../../shared/testing/i18n-testing/i18n-testing.module';
import { AnsweroptionsFreetextComponent } from './answeroptions-freetext.component';

describe('AnsweroptionsFreetextComponent', () => {
  let component: AnsweroptionsFreetextComponent;
  let fixture: ComponentFixture<AnsweroptionsFreetextComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule, RouterTestingModule, HttpClientTestingModule, JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID],
            },
          })
        ],
        providers: [
          RxStompService,
          {
            provide: CustomMarkdownService,
            useClass: CustomMarkdownServiceMock
          },
          {
            provide: QuizService,
            useClass: QuizMockService,
          }, HeaderLabelService, {
            provide: ThemesService,
            useClass: ThemesMockService
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, SharedService, {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of({
                get: () => 1,
              }),
              queryParamMap: of({
                get: () => null,
              }),
            },
          }, {
            provide: HotkeysService,
            useValue: {}
          },
        ],
        declarations: [AnsweroptionsFreetextComponent, TranslatePipeMock],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(AnsweroptionsFreetextComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));

  it('should contain a TYPE reference', (
    () => {
      expect(AnsweroptionsFreetextComponent.TYPE).toEqual('AnsweroptionsFreetextComponent');
    }
  ));

  it('should add a test input', () => {
    const value = 'Testinputvalue';
    const event = <any>{ target: { value } };
    component.setTestInput(event);
    expect(component.testInput).toEqual(value);
  });

  it('should add a match text to the answer text', () => {
    const value = 'Testinputvalue';
    const event = <any>{ target: { value } };
    component.setMatchText(event);
    expect(component.question.answerOptionList[0].answerText).toEqual(value);
  });

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

  it('should set a validation configuration of the question', () => {
    const initValue = (
      component.question.answerOptionList[0] as FreeTextAnswerEntity
    ).getConfig()[0];
    component.setConfig(initValue.id, !initValue.enabled);
    const newValue = (
      component.question.answerOptionList[0] as FreeTextAnswerEntity
    ).getConfig()[0];
    expect(newValue.id).toEqual(initValue.id);
    expect(newValue.enabled).not.toEqual(initValue.enabled);
  });

  it('should throw an error if an invalid config is set', () => {
    expect(() => component.setConfig('NotExisting', true)).toThrowError('Config not found');
  });

});
