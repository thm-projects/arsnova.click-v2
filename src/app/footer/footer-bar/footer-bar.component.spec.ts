import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FooterBarComponent} from './footer-bar.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {SettingsService} from '../../service/settings.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {FileUploadService} from '../../service/file-upload.service';
import {WebsocketService} from '../../service/websocket.service';
import {TrackingService} from '../../service/tracking.service';
import {SharedService} from '../../service/shared.service';
import {ConnectionService} from '../../service/connection.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {Angulartics2Module} from 'angulartics2';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('FooterBarComponent', () => {
  let component: FooterBarComponent;
  let fixture: ComponentFixture<FooterBarComponent>;

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
        FooterBarService,
        SharedService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        FileUploadService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
      ],
      declarations: [
        FooterBarComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FooterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(FooterBarComponent.TYPE).toEqual('FooterBarComponent');
  }));
});
