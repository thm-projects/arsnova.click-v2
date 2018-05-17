import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizManagerDetailsOverviewComponent} from './quiz-manager-details-overview.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {ConnectionService} from '../../../../service/connection.service';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {SharedService} from '../../../../service/shared.service';
import {SettingsService} from '../../../../service/settings.service';
import {WebsocketService} from '../../../../service/websocket.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TrackingService} from '../../../../service/tracking.service';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {ActivatedRoute} from '@angular/router';
import {TrackingMockService} from '../../../../service/tracking.mock.service';

class MockRouter {
  params = {
    subscribe: (cb) => {
      cb({
        questionIndex: 0
      });
    }
  };
}

describe('QuizManagerDetailsOverviewComponent', () => {
  let component: QuizManagerDetailsOverviewComponent;
  let fixture: ComponentFixture<QuizManagerDetailsOverviewComponent>;

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
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ActivatedRoute, useClass: MockRouter},
        SharedService,
        {provide: TrackingService, useClass: TrackingMockService},
      ],
      declarations: [QuizManagerDetailsOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizManagerDetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
