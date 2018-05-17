import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizOverviewComponent} from './quiz-overview.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ConnectionService} from '../../service/connection.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {SharedService} from '../../service/shared.service';
import {SettingsService} from '../../service/settings.service';
import {WebsocketService} from '../../service/websocket.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {TrackingService} from '../../service/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('QuizOverviewComponent', () => {
  let component: QuizOverviewComponent;
  let fixture: ComponentFixture<QuizOverviewComponent>;

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
        HeaderLabelService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
      ],
      declarations: [QuizOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
