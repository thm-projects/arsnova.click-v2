import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestionDetailsComponent} from './question-details.component';
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
import {QuestionTextService} from '../../../../service/question-text.service';
import {CurrentQuizMockService} from '../../../../service/current-quiz.mock.service';
import {ActivatedRoute} from '@angular/router';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../../service/attendee.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../../../service/tracking.mock.service';

class MockRouter {
  params = {
    subscribe: () => {
      return {
        questionIndex: 0
      };
    }
  };
}

describe('QuestionDetailsComponent', () => {
  let component: QuestionDetailsComponent;
  let fixture: ComponentFixture<QuestionDetailsComponent>;

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
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        I18nService,
        HeaderLabelService,
        {provide: AttendeeService, useClass: AttendeeMockService},
        QuestionTextService,
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        { provide: ActivatedRoute, useClass: MockRouter }
      ],
      declarations: [QuestionDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
