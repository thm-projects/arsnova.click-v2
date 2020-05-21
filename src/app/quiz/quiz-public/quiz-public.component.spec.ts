import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RxStompService } from '@stomp/ng2-stompjs';
import { SimpleMQ } from 'ng2-simple-mq';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { FileUploadMockService } from '../../service/file-upload/file-upload.mock.service';
import { FileUploadService } from '../../service/file-upload/file-upload.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizPublicComponent } from './quiz-public.component';

describe('QuizPublicComponent', () => {
  let component: QuizPublicComponent;
  let fixture: ComponentFixture<QuizPublicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, FontAwesomeModule, HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, SimpleMQ, FooterBarService, {
          provide: FileUploadService,
          useClass: FileUploadMockService,
        }, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => 0,
            }),
          },
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        },
      ],
      declarations: [QuizPublicComponent, TranslatePipeMock],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
