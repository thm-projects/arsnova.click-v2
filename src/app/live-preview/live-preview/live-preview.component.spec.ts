import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LivePreviewComponent} from './live-preview.component';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {RouterTestingModule} from '@angular/router/testing';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {Angulartics2Module} from 'angulartics2';
import {TrackingService} from '../../service/tracking.service';
import {WebsocketService} from '../../service/websocket.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SharedService} from '../../service/shared.service';
import {ConnectionService} from '../../service/connection.service';
import {QuestionTextService} from '../../service/question-text.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {HeaderModule} from '../../header/header.module';
import {FooterBarService} from '../../service/footer-bar.service';
import {SettingsService} from '../../service/settings.service';
import {DEVICE_TYPES, LIVE_PREVIEW_ENVIRONMENT} from '../../../environments/environment';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('LivePreviewComponent', () => {
  let component: LivePreviewComponent;
  let fixture: ComponentFixture<LivePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HeaderModule,
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
        QuestionTextService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        FooterBarService,
        SharedService,
        SettingsService,
        {provide: TrackingService, useClass: TrackingMockService},
      ],
      declarations: [LivePreviewComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LivePreviewComponent);
    component = fixture.componentInstance;
    component.targetEnvironment = LIVE_PREVIEW_ENVIRONMENT.QUESTION;
    component.targetDevice = DEVICE_TYPES.XS;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(LivePreviewComponent.TYPE).toEqual('LivePreviewComponent');
  }));
});
