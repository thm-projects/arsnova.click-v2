import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProgressBarComponent} from './progress-bar.component';
import {Angulartics2Module} from 'angulartics2';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ConnectionService} from '../../../../service/connection.service';
import {createTranslateLoader} from '../../../../../lib/translation.factory';
import {TrackingService} from '../../../../service/tracking.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {SettingsService} from '../../../../service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {I18nService} from '../../../../service/i18n.service';
import {ArsnovaClickAngulartics2Piwik} from '../../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {AttendeeService} from '../../../../service/attendee.service';
import {CurrentQuizService} from '../../../../service/current-quiz.service';
import {SharedService} from '../../../../service/shared.service';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {WebsocketService} from '../../../../service/websocket.service';
import {ProgressBarSingleChoiceComponent} from './progress-bar-single-choice/progress-bar-single-choice.component';
import {ProgressBarSurveyComponent} from './progress-bar-survey/progress-bar-survey.component';
import {ProgressBarMultipleChoiceComponent} from './progress-bar-multiple-choice/progress-bar-multiple-choice.component';
import {ProgressBarRangedComponent} from './progress-bar-ranged/progress-bar-ranged.component';
import {ProgressBarFreetextComponent} from './progress-bar-freetext/progress-bar-freetext.component';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {CurrentQuizMockService} from '../../../../service/current-quiz.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../../service/attendee.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../../../service/tracking.mock.service';

describe('ProgressBarComponent', () => {
  let component: ProgressBarComponent;
  let fixture: ComponentFixture<ProgressBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
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
        NgbActiveModal,
        {provide: TrackingService, useClass: TrackingMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        I18nService,
        HeaderLabelService,
        {provide: AttendeeService, useClass: AttendeeMockService},
      ],
      declarations: [
        ProgressBarSingleChoiceComponent,
        ProgressBarMultipleChoiceComponent,
        ProgressBarSurveyComponent,
        ProgressBarRangedComponent,
        ProgressBarFreetextComponent,
        ProgressBarComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
