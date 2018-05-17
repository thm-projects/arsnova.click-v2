import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {VotingComponent} from './voting.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {AttendeeService} from '../../../service/attendee.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {ConnectionService} from '../../../service/connection.service';
import {QuestionTextService} from '../../../service/question-text.service';
import {HeaderLabelService} from '../../../service/header-label.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SharedService} from '../../../service/shared.service';
import {SettingsService} from '../../../service/settings.service';
import {WebsocketService} from '../../../service/websocket.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../service/attendee.mock.service';
import {DefaultSettings} from '../../../../lib/default.settings';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';

describe('VotingComponent', () => {
  let component: VotingComponent;
  let fixture: ComponentFixture<VotingComponent>;

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
        })
      ],
      providers: [
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: AttendeeService, useClass: AttendeeMockService},
        FooterBarService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        QuestionTextService,
        HeaderLabelService,
        SettingsService,
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
      ],
      declarations: [VotingComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VotingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(inject([HttpClient, HttpTestingController],
    (http: HttpClient, backend: HttpTestingController) => {
      const url = `${DefaultSettings.httpApiEndpoint}/quiz/startTime/test`;
      backend.expectOne(url).flush({
        status: 'STATUS:SUCCESSFUL',
        step: '',
        payload: {
          startTimestamp: new Date().getTime()
        }
      });
      backend.verify();
      expect(component).toBeTruthy();
    }))
  );
});
