import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../../_mocks/_pipes/TranslatePipeMock';
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
import { AnsweroptionsRangedComponent } from './answeroptions-ranged.component';

describe('AnsweroptionsRangedComponent', () => {
  let component: AnsweroptionsRangedComponent;
  let fixture: ComponentFixture<AnsweroptionsRangedComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule, RouterTestingModule, HttpClientTestingModule, FormsModule, JwtModule.forRoot({
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
          }, {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of({
                get: () => 2,
              }),
              queryParamMap: of({
                get: () => 2,
              }),
            },
          }, SharedService, {
            provide: HotkeysService,
            useValue: {}
          },
        ],
        declarations: [AnsweroptionsRangedComponent, TranslatePipeMock],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(AnsweroptionsRangedComponent);
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
      expect(AnsweroptionsRangedComponent.TYPE).toEqual('AnsweroptionsRangedComponent');
    }
  ));
});
