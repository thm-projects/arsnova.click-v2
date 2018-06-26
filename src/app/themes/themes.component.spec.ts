import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../lib/translation.factory';
import { ConnectionMockService } from '../service/connection/connection.mock.service';
import { ConnectionService } from '../service/connection/connection.service';
import { CurrentQuizMockService } from '../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../service/footer-bar/footer-bar.service';
import { SettingsService } from '../service/settings/settings.service';
import { SharedService } from '../service/shared/shared.service';
import { ThemesService } from '../service/themes/themes.service';
import { TrackingMockService } from '../service/tracking/tracking.mock.service';
import { TrackingService } from '../service/tracking/tracking.service';
import { WebsocketMockService } from '../service/websocket/websocket.mock.service';
import { WebsocketService } from '../service/websocket/websocket.service';
import { SharedModule } from '../shared/shared.module';

import { ThemesComponent } from './themes.component';

describe('ThemesComponent', () => {
  let component: ThemesComponent;
  let fixture: ComponentFixture<ThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule, RouterTestingModule, HttpClientModule, HttpClientTestingModule, TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (
              createTranslateLoader
            ),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        TranslateService, FooterBarService, SettingsService, {
          provide: CurrentQuizService,
          useClass: CurrentQuizMockService,
        }, {
          provide: WebsocketService,
          useClass: WebsocketMockService,
        }, SharedService, {
          provide: ConnectionService,
          useClass: ConnectionMockService,
        }, {
          provide: TrackingService,
          useClass: TrackingMockService,
        }, ThemesService,
      ],
      declarations: [
        ThemesComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
