import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Angulartics2Module} from 'angulartics2';
import {WebsocketService} from '../../service/websocket.service';
import {TrackingService} from '../../service/tracking.service';
import {SharedService} from '../../service/shared.service';
import {ConnectionService} from '../../service/connection.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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
        HeaderLabelService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        SharedService,
        {provide: WebsocketService, useClass: WebsocketMockService},
      ],
      declarations: [
        HeaderComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));

  it('should contain a TYPE definition', async(() => {
    expect(HeaderComponent.TYPE).toEqual('HeaderComponent');
  }));
});
