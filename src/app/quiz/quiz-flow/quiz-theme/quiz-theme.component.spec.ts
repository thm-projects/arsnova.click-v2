import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {QuizThemeComponent} from './quiz-theme.component';
import {FooterBarService} from '../../../service/footer-bar.service';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {ThemesService} from '../../../service/themes.service';
import {ThemesComponent} from '../../../themes/themes.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SettingsService} from '../../../service/settings.service';
import {ConnectionService} from '../../../service/connection.service';
import {WebsocketService} from '../../../service/websocket.service';
import {SharedService} from '../../../service/shared.service';
import {TrackingService} from '../../../service/tracking.service';
import {Angulartics2Module} from 'angulartics2';
import {ArsnovaClickAngulartics2Piwik} from '../../../shared/tracking/ArsnovaClickAngulartics2Piwik';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';
import {TrackingMockService} from '../../../service/tracking.mock.service';

describe('QuizThemeComponent', () => {
  let component: QuizThemeComponent;
  let fixture: ComponentFixture<QuizThemeComponent>;

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
        {provide: CurrentQuizService, useClass: CurrentQuizMockService},
        ThemesService,
        SettingsService,
        {provide: ConnectionService, useClass: ConnectionMockService},
        {provide: WebsocketService, useClass: WebsocketMockService},
        SharedService,
        {provide: TrackingService, useClass: TrackingMockService},
      ],
      declarations: [ThemesComponent, QuizThemeComponent]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuizThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
