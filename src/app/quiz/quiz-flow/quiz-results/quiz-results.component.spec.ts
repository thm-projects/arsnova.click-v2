import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {QuizResultsComponent} from './quiz-results.component';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {Angulartics2Module} from 'angulartics2';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {ArsnovaClickAngulartics2Piwik} from '../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ReadingConfirmationComponent} from './reading-confirmation/reading-confirmation.component';
import {ConfidenceRateComponent} from './confidence-rate/confidence-rate.component';
import {ProgressBarComponent} from './progress-bar/progress-bar.component';
import {ProgressBarSingleChoiceComponent} from './progress-bar/progress-bar-single-choice/progress-bar-single-choice.component';
import {ProgressBarMultipleChoiceComponent} from './progress-bar/progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import {ProgressBarSurveyComponent} from './progress-bar/progress-bar-survey/progress-bar-survey.component';
import {ProgressBarRangedComponent} from './progress-bar/progress-bar-ranged/progress-bar-ranged.component';
import {ProgressBarFreetextComponent} from './progress-bar/progress-bar-freetext/progress-bar-freetext.component';
import {AudioPlayerComponent} from '../../../shared/audio-player/audio-player.component';
import {GamificationAnimationComponent} from '../../../shared/gamification-animation/gamification-animation.component';
import {ConnectionService} from '../../../service/connection.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SharedService} from '../../../service/shared.service';
import {SettingsService} from '../../../service/settings.service';
import {WebsocketService} from '../../../service/websocket.service';
import {AttendeeService} from '../../../service/attendee.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {I18nService, Languages} from '../../../service/i18n.service';
import {QuestionTextService} from '../../../service/question-text.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../service/attendee.mock.service';

describe('QuizResultsComponent', () => {
  let component: QuizResultsComponent;
  let fixture: ComponentFixture<QuizResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient]
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler
          }
        }),
      ],
      providers: [
        TranslateService,
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: AttendeeService, useClass: AttendeeMockService},
        HeaderLabelService,
        I18nService,
        QuestionTextService
      ],
      declarations: [
        ConfidenceRateComponent,
        ProgressBarComponent,
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ReadingConfirmationComponent,
        AudioPlayerComponent,
        GamificationAnimationComponent,
        QuizResultsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizResultsComponent);
    component = fixture.componentInstance;
    component.i18nService.currentLanguage = Languages.EN;
    fixture.detectChanges();
  }));

  it(`should be created`, async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      expect(component).toBeTruthy();
    }))
  );
});
