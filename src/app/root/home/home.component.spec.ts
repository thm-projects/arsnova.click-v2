import {async, inject, TestBed} from '@angular/core/testing';

import {HomeComponent} from './home.component';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {HeaderLabelService} from '../../service/header-label.service';
import {ConnectionService} from '../../service/connection.service';
import {TrackingService} from '../../service/tracking.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {SharedService} from '../../service/shared.service';
import {SettingsService} from '../../service/settings.service';
import {WebsocketService} from '../../service/websocket.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ActiveQuestionGroupService} from '../../service/active-question-group.service';
import {CurrentQuizService} from '../../service/current-quiz.service';
import {CurrentQuizMockService} from '../../service/current-quiz.mock.service';
import {ThemesService} from '../../service/themes.service';
import {I18nService} from '../../service/i18n.service';
import {AttendeeService} from '../../service/attendee.service';
import {CasService} from '../../service/cas.service';
import {UserService} from '../../service/user.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {AttendeeMockService} from '../../service/attendee.mock.service';
import {ActiveQuestionGroupMockService} from '../../service/active-question-group.mock.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('HomeComponent', () => {
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
        NgbModule.forRoot(),
      ],
      providers: [
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        HeaderLabelService,
        {provide: ActiveQuestionGroupService, useClass: ActiveQuestionGroupMockService},
        ThemesService,
        I18nService,
        {provide: AttendeeService, useClass: AttendeeMockService},
        CasService,
        UserService,
        {provide: TrackingService, useClass: TrackingMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService}
      ],
      declarations: [HomeComponent],
    }).compileComponents();
  }));

  it('should create the app', async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      const fixture = TestBed.createComponent(HomeComponent);
      const app = fixture.debugElement.componentInstance;

      expect(app).toBeTruthy();
    }))
  );

  it('should render \'arsnova.click\' in the main view', async(() => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    const mainText = compiled.querySelector('#arsnova-click-description').textContent.trim().replace(/\s*\n*/g, '');
    expect(mainText).toContain('arsnova.click');
  }));
});
