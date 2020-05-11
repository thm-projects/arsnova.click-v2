import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { GenericFilterPipeMock } from '../../quiz/quiz-manager/quiz-manager/quiz-type-select-modal/quiz-type-select-modal.component.spec';
import { CustomMarkdownService } from '../../service/custom-markdown/custom-markdown.service';
import { CustomMarkdownServiceMock } from '../../service/custom-markdown/CustomMarkdownServiceMock';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizPoolAdminComponent } from './quiz-pool-admin.component';

describe('QuizPoolAdminComponent', () => {
  let component: QuizPoolAdminComponent;
  let fixture: ComponentFixture<QuizPoolAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, I18nTestingModule, RouterTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, SimpleMQ, {
          provide: CustomMarkdownService,
          useClass: CustomMarkdownServiceMock,
        },
      ],
        declarations: [QuizPoolAdminComponent, GenericFilterPipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPoolAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
