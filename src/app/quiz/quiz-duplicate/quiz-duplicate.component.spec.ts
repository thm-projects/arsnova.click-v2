import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { TranslateService } from '@ngx-translate/core';
import { RxStompService } from '@stomp/ng2-stompjs';
import { MarkdownService, MarkedOptions } from 'ngx-markdown';
import { TranslateServiceMock } from '../../../_mocks/_services/TranslateServiceMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { QuizDuplicateComponent } from './quiz-duplicate.component';

describe('QuizDuplicateComponent', () => {
  let component: QuizDuplicateComponent;
  let fixture: ComponentFixture<QuizDuplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        MarkdownService, {
          provide: MarkedOptions,
          useValue: {},
        }, RxStompService, {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
      ],
      declarations: [QuizDuplicateComponent],
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizDuplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
