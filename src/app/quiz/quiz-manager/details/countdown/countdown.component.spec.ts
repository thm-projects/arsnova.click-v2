import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHourglass } from '@fortawesome/free-solid-svg-icons';
import { RxStompService } from '@stomp/ng2-stompjs';
import { of } from 'rxjs';
import { TranslatePipeMock } from '../../../../../_mocks/_pipes/TranslatePipeMock';
import { jwtOptionsFactory } from '../../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../../service/connection/connection.service';
import { FooterBarService } from '../../../../service/footer-bar/footer-bar.service';
import { HeaderLabelService } from '../../../../service/header-label/header-label.service';
import { QuizMockService } from '../../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../../service/quiz/quiz.service';
import { SettingsService } from '../../../../service/settings/settings.service';
import { SharedService } from '../../../../service/shared/shared.service';
import { StorageService } from '../../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../../service/themes/themes.service';
import { TwitterService } from '../../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../../service/twitter/twitter.service.mock';
import { I18nTestingModule } from '../../../../shared/testing/i18n-testing/i18n-testing.module';
import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        I18nTestingModule, HttpClientTestingModule, RouterTestingModule, FormsModule, FontAwesomeModule, JwtModule.forRoot({
          jwtOptionsProvider: {
            provide: JWT_OPTIONS,
            useFactory: jwtOptionsFactory,
            deps: [PLATFORM_ID],
          },
        }),
      ],
      providers: [
        RxStompService, {
          provide: StorageService,
          useClass: StorageServiceMock,
        }, {
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
              get: () => 0,
            }),
            queryParamMap: of({
              get: () => 0,
            }),
          },
        }, SharedService, {
          provide: TwitterService,
          useClass: TwitterServiceMock,
        },
      ],
      declarations: [CountdownComponent, TranslatePipeMock],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
    library.addIcons(faHourglass);
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    component['_questionIndex'] = 0;
    fixture.detectChanges();
  }));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));

  it('should contain a TYPE reference', (
    () => {
      expect(CountdownComponent.TYPE).toEqual('CountdownComponent');
    }
  ));

  it('should update the countdown', inject([QuizService], (quizService: QuizService) => {
    const initValue = quizService.quiz.questionList[0].timer;
    const newValue = initValue + 10;

    component.updateCountdown(newValue);

    expect(quizService.quiz.questionList[0].timer).toEqual(newValue);
    expect(component.countdown).toEqual(String(newValue));
  }));
});
