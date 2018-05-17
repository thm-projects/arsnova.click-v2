import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfidenceRateComponent} from './confidence-rate.component';
import {ArsnovaClickAngulartics2Piwik} from '../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {RouterTestingModule} from '@angular/router/testing';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {Angulartics2Module} from 'angulartics2';
import {SettingsService} from '../../../service/settings.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {WebsocketService} from '../../../service/websocket.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SharedService} from '../../../service/shared.service';
import {ConnectionService} from '../../../service/connection.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {AttendeeService} from '../../../service/attendee.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../service/attendee.mock.service';

describe('ConfidenceRateComponent', () => {
  let component: ConfidenceRateComponent;
  let fixture: ComponentFixture<ConfidenceRateComponent>;

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
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: AttendeeService, useClass: AttendeeMockService},
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        HeaderLabelService,
        FooterBarService,
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        SettingsService
      ],
      declarations: [ ConfidenceRateComponent ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ConfidenceRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
