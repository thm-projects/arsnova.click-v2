import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoComponent} from './info.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Angulartics2Module} from 'angulartics2';
import {createTranslateLoader} from '../../../lib/translation.factory';
import {ArsnovaClickAngulartics2Piwik} from '../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ConnectionService} from '../../service/connection.service';
import {FooterBarService} from '../../service/footer-bar.service';
import {SharedService} from '../../service/shared.service';
import {SettingsService} from '../../service/settings.service';
import {WebsocketService} from '../../service/websocket.service';
import {TrackingService} from '../../service/tracking.service';
import {HeaderLabelService} from '../../service/header-label.service';
import {WebsocketMockService} from '../../service/websocket.mock.service';
import {ConnectionMockService} from '../../service/connection.mock.service';
import {TrackingMockService} from '../../service/tracking.mock.service';

describe('InfoComponent', () => {
  let component: InfoComponent;
  let fixture: ComponentFixture<InfoComponent>;

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
        FooterBarService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: TrackingService, useClass: TrackingMockService},
        HeaderLabelService
      ],
      declarations: [InfoComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
