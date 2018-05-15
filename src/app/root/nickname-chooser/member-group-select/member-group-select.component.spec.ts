import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberGroupSelectComponent } from './member-group-select.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {ConnectionService} from '../../../service/connection.service';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {SettingsService} from '../../../service/settings.service';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {FooterBarService} from '../../../service/footer-bar.service';
import {AttendeeService} from '../../../service/attendee.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SharedService} from '../../../service/shared.service';
import {UserService} from '../../../service/user.service';
import {WebsocketService} from '../../../service/websocket.service';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {AttendeeMockService} from '../../../service/attendee.mock.service';

describe('MemberGroupSelectComponent', () => {
  let component: MemberGroupSelectComponent;
  let fixture: ComponentFixture<MemberGroupSelectComponent>;

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
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: AttendeeService, useClass: AttendeeMockService},
        UserService
      ],
      declarations: [ MemberGroupSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MemberGroupSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', async(() => {
    expect(component).toBeTruthy();
  }));
});
