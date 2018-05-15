import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AnsweroptionsComponent} from './answeroptions.component';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {ConnectionService} from '../../../../service/connection.service';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {SharedService} from '../../../../service/shared.service';
import {SettingsService} from '../../../../service/settings.service';
import {WebsocketService} from '../../../../service/websocket.service';
import {AnsweroptionsDefaultComponent} from './answeroptions-default/answeroptions-default.component';
import {AnsweroptionsFreetextComponent} from './answeroptions-freetext/answeroptions-freetext.component';
import {AnsweroptionsRangedComponent} from './answeroptions-ranged/answeroptions-ranged.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {LivePreviewComponent} from '../../../../live-preview/live-preview/live-preview.component';
import {HeaderComponent} from '../../../../header/header/header.component';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {ActivatedRoute} from '@angular/router';
import {QuestionTextService} from '../../../../service/question-text.service';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TrackingService} from '../../../../service/tracking.service';
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


describe('AnsweroptionsComponent', () => {
  let component: AnsweroptionsComponent;
  let fixture: ComponentFixture<AnsweroptionsComponent>;

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
        NgbModalModule.forRoot(),
      ],
      providers: [
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        HeaderLabelService,
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: ActivatedRoute, useClass: MockRouter},
        SharedService,
        QuestionTextService,
        {provide: TrackingService, useClass: TrackingMockService},
      ],
      declarations: [
        HeaderComponent,
        LivePreviewComponent,
        AnsweroptionsDefaultComponent,
        AnsweroptionsFreetextComponent,
        AnsweroptionsRangedComponent,
        AnsweroptionsComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnsweroptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
