import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { RxStompService } from '@stomp/ng2-stompjs';
import { HotkeysService } from 'angular2-hotkeys';
import { Observable, of } from 'rxjs';
import { QuizMock } from '../../../_mocks/_fixtures/quiz.mock';
import { QuizAdminFilterPipeMock } from '../../../_mocks/_pipes/QuizAdminFilterPipeMock';
import { QuizState } from '../../lib/enums/QuizState';
import { jwtOptionsFactory } from '../../lib/jwt.factory';
import { AdminApiService } from '../../service/api/admin/admin-api.service';
import { ConnectionMockService } from '../../service/connection/connection.mock.service';
import { ConnectionService } from '../../service/connection/connection.service';
import { FooterBarService } from '../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../service/header-label/header-label.service';
import { I18nService } from '../../service/i18n/i18n.service';
import { QuizMockService } from '../../service/quiz/quiz-mock.service';
import { QuizService } from '../../service/quiz/quiz.service';
import { SettingsService } from '../../service/settings/settings.service';
import { SharedService } from '../../service/shared/shared.service';
import { StorageService } from '../../service/storage/storage.service';
import { StorageServiceMock } from '../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../service/themes/themes.mock.service';
import { ThemesService } from '../../service/themes/themes.service';
import { TrackingMockService } from '../../service/tracking/tracking.mock.service';
import { TrackingService } from '../../service/tracking/tracking.service';
import { TwitterService } from '../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../service/twitter/twitter.service.mock';
import { UserService } from '../../service/user/user.service';
import { SharedModule } from '../../shared/shared.module';
import { I18nTestingModule } from '../../shared/testing/i18n-testing/i18n-testing.module';
import { QuizAdminComponent } from './quiz-admin.component';

describe('QuizAdminComponent', () => {
  let component: QuizAdminComponent;
  let fixture: ComponentFixture<QuizAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, SharedModule, RouterTestingModule, HttpClientTestingModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID, StorageService],
          },
        }),
      ],
      providers: [
        RxStompService, I18nService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, HeaderLabelService, ThemesService, {
          provide: QuizService,
          useClass: QuizMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, {
          provide: ThemesService,
          useClass: ThemesMockService
        }, FooterBarService, SettingsService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, SharedService, {
          provide: UserService,
          useValue: {},
        }, JwtHelperService, {
          provide: AdminApiService,
          useValue: {
            getAvailableQuizzes: () => of([{ ...QuizMock }]),
            deactivateQuiz: () => new Observable(subscriber => {
              subscriber.next();
              subscriber.complete();
            }),
            deleteQuiz: () => new Observable(subscriber => {
              subscriber.next();
              subscriber.complete();
            }),
          },
        }, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        }, {
          provide: HotkeysService,
          useValue: {}
        },
      ],
      declarations: [
        QuizAdminFilterPipeMock, QuizAdminComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if a quiz has a state considered as "active"', () => {
    expect(component.isActiveQuiz(component.quizzes[0])).toBeTruthy();
    component.quizzes[0].state = QuizState.Inactive;
    expect(component.isActiveQuiz(component.quizzes[0])).toBeFalsy();
  });

  it('should deactivate a quiz', () => {
    expect(component.isActiveQuiz(component.quizzes[0])).toBeTruthy();
    component.deactivateQuiz(component.quizzes[0]);
    expect(component.isActiveQuiz(component.quizzes[0])).toBeFalsy();
  });

  it('should delete a quiz', () => {
    component.deleteElem(component.quizzes[0]);
    expect(component.quizzes.length).toEqual(0);
  });
});
