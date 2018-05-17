import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AvailableQuizzesComponent} from './available-quizzes.component';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {TrackingService} from '../../service/tracking.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {Angulartics2Module} from 'angulartics2';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {SettingsService} from '../../service/settings.service';
import {ConnectionService} from '../../service/connection.service';
import {WebsocketService} from '../../service/websocket.service';
import {SharedService} from '../../service/shared.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('AvailableQuizzesComponent', () => {
  let component: AvailableQuizzesComponent;
  let fixture: ComponentFixture<AvailableQuizzesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        NgbModule.forRoot(),
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
      ],
      declarations: [AvailableQuizzesComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AvailableQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
