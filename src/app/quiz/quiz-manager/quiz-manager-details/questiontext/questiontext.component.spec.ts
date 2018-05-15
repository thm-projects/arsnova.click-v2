import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuestiontextComponent} from './questiontext.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ConnectionService} from '../../../../service/connection.service';
import {createTranslateLoader} from '../../../../../lib/translation.factory';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SettingsService} from '../../../../service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HeaderLabelService} from '../../../../service/header-label.service';
import {FooterBarService} from '../../../../service/footer-bar.service';
import {ActiveQuestionGroupService} from '../../../../service/active-question-group.service';
import {SharedService} from '../../../../service/shared.service';
import {WebsocketService} from '../../../../service/websocket.service';
import {QuestionTextService} from '../../../../service/question-text.service';
import {MarkdownBarComponent} from '../../../../markdown/markdown-bar/markdown-bar.component';
import {HeaderComponent} from '../../../../header/header/header.component';
import {LivePreviewComponent} from '../../../../live-preview/live-preview/live-preview.component';
import {TrackingService} from '../../../../service/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {WebsocketMockService} from '../../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../../../service/active-question-group.mock.service';
import {ActivatedRoute} from '@angular/router';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
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

describe('QuestiontextComponent', () => {
  let component: QuestiontextComponent;
  let fixture: ComponentFixture<QuestiontextComponent>;

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
        MarkdownBarComponent,
        QuestiontextComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuestiontextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
