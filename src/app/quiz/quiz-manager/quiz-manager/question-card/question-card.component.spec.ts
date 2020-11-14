import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwPush } from '@angular/service-worker';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { SimpleMQ } from 'ng2-simple-mq';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../service/themes/themes.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';

import { QuestionCardComponent } from './question-card.component';

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
        imports: [
          JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID, StorageService],
            },
          }), RouterTestingModule, I18nTestingModule, HttpClientTestingModule,
        ],
        declarations: [QuestionCardComponent, TranslatePipeMock],
        providers: [
          RxStompService, SimpleMQ, {
            provide: StorageService,
            useClass: StorageServiceMock,
          }, {
            provide: QuizService,
            useClass: QuizMockService,
          }, {
            provide: ThemesService,
            useClass: ThemesMockService
          }, {
            provide: TrackingService,
            useClass: TrackingMockService,
          }, {
            provide: CustomMarkdownService,
            useClass: CustomMarkdownServiceMock,
          }, {
            provide: SwPush,
            useValue: {}
          }, {
            provide: HotkeysService,
            useValue: {}
          },
        ],
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
