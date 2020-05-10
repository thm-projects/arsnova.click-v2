import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { CustomMarkdownService } from '../../../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../../../service/custom-markdown/CustomMarkdownServiceMock';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { TrackingMockService } from '../../../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../../../service/tracking/tracking.service';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';

import { QuestionCardComponent } from './question-card.component';

describe('QuestionCardComponent', () => {
  let component: QuestionCardComponent;
  let fixture: ComponentFixture<QuestionCardComponent>;

  beforeEach(async(() => {
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
          {
            provide: QuizService,
            useClass: QuizMockService,
          }, {
            provide: TrackingService,
            useClass: TrackingMockService,
          }, {
            provide: CustomMarkdownService,
            useClass: CustomMarkdownServiceMock,
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
