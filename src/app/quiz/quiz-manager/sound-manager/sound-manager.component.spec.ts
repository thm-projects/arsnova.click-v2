import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { CurrentQuizMockService } from '../../../service/current-quiz/current-quiz.mock.service';
import { CurrentQuizService } from '../../../service/current-quiz/current-quiz.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { AudioPlayerComponent } from '../../../shared/audio-player/audio-player.component';

import { SoundManagerComponent } from './sound-manager.component';

describe('SoundManagerComponent', () => {
  let component: SoundManagerComponent;
  let fixture: ComponentFixture<SoundManagerComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (createTranslateLoader),
            deps: [HttpClient],
          },
          compiler: {
            provide: TranslateCompiler,
            useClass: TranslateMessageFormatCompiler,
          },
        }),
      ],
      providers: [
        { provide: CurrentQuizService, useClass: CurrentQuizMockService },
        FooterBarService,
        SettingsService,
        { provide: ConnectionService, useClass: ConnectionMockService },
        { provide: WebsocketService, useClass: WebsocketMockService },
        SharedService,
      ],
      declarations: [
        AudioPlayerComponent,
        SoundManagerComponent,
      ],
    }).compileComponents();
  }));

  beforeEach((() => {
    fixture = TestBed.createComponent(SoundManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', (() => {
    expect(component).toBeTruthy();
  }));
  it('should contain a TYPE reference', (() => {
    expect(SoundManagerComponent.TYPE).toEqual('SoundManagerComponent');
  }));

  describe('#selectSound', () => {
    it('should select a given sound title', inject(
      [CurrentQuizService], (currentQuizService: CurrentQuizService) => {
        const value = 'Song1';
        const event = <any>{ target: { value } };
        component.selectSound('lobby', event);
        expect(currentQuizService.quiz.sessionConfig.music.titleConfig.lobby).toEqual(value);
      }));
  });

  describe('#setGlobalVolume', () => {
    it('should set the global volume', inject(
      [CurrentQuizService], (currentQuizService: CurrentQuizService) => {
        const value = 10;
        const event = <any>{ target: { value } };
        component.setGlobalVolume(event);
        expect(currentQuizService.quiz.sessionConfig.music.volumeConfig.global).toEqual(value);
      }));
  });

  describe('#openTab', () => {
    it('should open a config tab', inject(
      [CurrentQuizService], (currentQuizService: CurrentQuizService) => {
        const id = 'panel-lobby';
        component.openTab(id);
        expect(document.getElementById(id).classList).toContain('show');
      }));
  });
});
