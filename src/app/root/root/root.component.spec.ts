import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {RootComponent} from './root.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Angulartics2Module} from 'angulartics2';
import {ConnectionService} from '../../service/connection.service';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {TrackingService} from '../../service/tracking.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SettingsService} from '../../service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HeaderLabelService} from '../../service/header-label.service';
import {ThemesService} from '../../service/themes.service';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {FooterBarService} from '../../service/footer-bar.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {SharedService} from '../../service/shared.service';
import {WebsocketService} from '../../service/websocket.service';
import {HeaderComponent} from '../../header/header/header.component';
import {FooterBarComponent} from '../../footer/footer-bar/footer-bar.component';
import {I18nService} from '../../service/i18n.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FileUploadService} from '../../service/file-upload.service';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {DefaultSettings} from '../../../lib/default.settings';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('RootComponent', () => {
  let component: RootComponent;
  let fixture: ComponentFixture<RootComponent>;

  beforeEach((() => {
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
        NgbModule.forRoot(),
      ],
      providers: [
        HeaderLabelService,
        ThemesService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        I18nService,
        FileUploadService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
      ],
      declarations: [
        HeaderComponent,
        FooterBarComponent,
        RootComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      const environmentData = require(`../../../assets/serverEndpoint.json`);
      backend.expectOne(`assets/serverEndpoint.json`).flush(environmentData);
      backend.expectOne(`./assets/i18n/en.json`).flush({});
      backend.expectOne(`${DefaultSettings.httpApiEndpoint}/themes`).flush({});
      backend.verify();
      expect(component).toBeTruthy();
    }))
  );
});
