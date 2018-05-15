import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SoundManagerComponent} from './sound-manager.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../../../lib/translation.factory';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateMessageFormatCompiler} from 'ngx-translate-messageformat-compiler';
import {ConnectionService} from '../../../service/connection.service';
import {CurrentQuizMockService} from '../../../service/current-quiz.mock.service';
import {FooterBarService} from '../../../service/footer-bar.service';
import {CurrentQuizService} from '../../../service/current-quiz.service';
import {SharedService} from '../../../service/shared.service';
import {SettingsService} from '../../../service/settings.service';
import {WebsocketService} from '../../../service/websocket.service';
import {AudioPlayerComponent} from '../../../shared/audio-player/audio-player.component';
import {WebsocketMockService} from '../../../service/websocket.mock.service';
import {ConnectionMockService} from '../../../service/connection.mock.service';

describe('SoundManagerComponent', () => {
  let component: SoundManagerComponent;
  let fixture: ComponentFixture<SoundManagerComponent>;

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
      ],
      declarations: [
        AudioPlayerComponent,
        SoundManagerComponent
      ]
    }).compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SoundManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', async(() => {
    expect(component).toBeTruthy();
  }));
});
