import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {LeaderboardComponent} from './leaderboard.component';
import {ArsnovaClickAngulartics2Piwik} from '../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ActiveQuestionGroupService} from '../../../service/active-question-group.service';
import {RouterTestingModule} from '@angular/router/testing';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {Angulartics2Module} from 'angulartics2';
import {SettingsService} from '../../../service/settings.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {TrackingService} from '../../../service/tracking.service';
import {WebsocketService} from '../../../service/websocket.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SharedService} from '../../../service/shared.service';
import {ConnectionService} from '../../../service/connection.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {I18nService} from '../../../service/i18n.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {AttendeeService} from '../../../service/attendee.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DefaultSettings} from '../../../../lib/default.settings';
import {AttendeeMockService} from '../../../service/attendee.mock.service';
import {ActiveQuestionGroupMockService} from '../../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../../service/tracking.mock.service';

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;

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
      declarations: [LeaderboardComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      const url = `${DefaultSettings.httpApiEndpoint}/quiz/leaderboard/test/`;
      backend.expectOne(url).flush({
        status: 'STATUS:SUCCESSFUL',
        step: '',
        payload: {
          correctResponses: [],
          partiallyCorrectResponses: [],
          memberGroupResults: []
        }
      });
      backend.verify();
      expect(component).toBeTruthy();
    }))
  );
});
