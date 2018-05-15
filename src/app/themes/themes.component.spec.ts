import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {ThemesComponent} from './themes.component';
import {TranslateCompiler, TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ThemesService} from '../service/themes.service';
import {CurrentQuizService} from '../service/current-quiz.service';
import {ConnectionService} from '../service/connection.service';
import {FooterBarService} from '../service/footer-bar.service';
import {SharedService} from '../service/shared.service';
import {SettingsService} from '../service/settings.service';
import {WebsocketService} from '../service/websocket.service';
import {TrackingService} from '../service/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {WebsocketMockService} from '../service/websocket.mock.service';
import {CurrentQuizMockService} from '../service/current-quiz.mock.service';
import {ConnectionMockService} from '../service/connection.mock.service';
import {DefaultSettings} from '../../lib/default.settings';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TrackingMockService} from '../service/tracking.mock.service';

describe('ThemesComponent', () => {
  let component: ThemesComponent;
  let fixture: ComponentFixture<ThemesComponent>;

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
      ],
      providers: [
        TranslateService,
        FooterBarService,
        SettingsService,
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: TrackingService, useClass: TrackingMockService},
        ThemesService
      ],
      declarations: [
        ThemesComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(inject([HttpClient, HttpTestingController],
    async (http: HttpClient, backend: HttpTestingController) => {
      backend.expectOne(`${DefaultSettings.httpApiEndpoint}/themes`).flush({});
      backend.match(`${DefaultSettings.httpLibEndpoint}/linkImages/theme-Material`).forEach(match => {
        match.flush([]);
      });
      await expect(component).toBeTruthy();
      backend.verify();
    }))
  );
});
