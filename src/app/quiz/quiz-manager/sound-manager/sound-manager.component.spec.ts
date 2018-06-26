import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { createTranslateLoader } from '../../../../lib/translation.factory';
import { ActiveQuestionGroupMockService } from '../../../service/active-question-group/active-question-group.mock.service';
import { ActiveQuestionGroupService } from '../../../service/active-question-group/active-question-group.service';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { WebsocketMockService } from '../../../service/websocket/websocket.mock.service';
import { WebsocketService } from '../../../service/websocket/websocket.service';
import { SharedModule } from '../../../shared/shared.module';

import { SoundManagerComponent } from './sound-manager.component';

describe('SoundManagerComponent', () => {
  let component: SoundManagerComponent;
  let fixture: ComponentFixture<SoundManagerComponent>;

  beforeEach((
    () => {
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
          {
            provide: ActiveQuestionGroupService,
            useClass: ActiveQuestionGroupMockService,
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, {
            provide: WebsocketService,
            useClass: WebsocketMockService,
          }, SharedService,
        ],
        declarations: [
          SoundManagerComponent,
        ],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      fixture = TestBed.createComponent(SoundManagerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    }
  ));

  it('should be created', (
    () => {
      expect(component).toBeTruthy();
    }
  ));
  it('should contain a TYPE reference', (
    () => {
      expect(SoundManagerComponent.TYPE).toEqual('SoundManagerComponent');
    }
  ));

  describe('#selectSound', () => {
    it('should select a given sound title', inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
      const value = 'Song1';
      const event = <any>{ target: { value } };
      component.selectSound('lobby', event);
      expect(activeQuestionGroupService.activeQuestionGroup.sessionConfig.music.titleConfig.lobby).toEqual(value);
    }));
  });

  describe('#setGlobalVolume', () => {
    it('should set the global volume', inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
      const value = 10;
      const event = <any>{ target: { value } };
      component.setGlobalVolume(event);
      expect(activeQuestionGroupService.activeQuestionGroup.sessionConfig.music.volumeConfig.global).toEqual(value);
    }));
  });

  describe('#openTab', () => {
    it('should open a config tab', inject([ActiveQuestionGroupService], (activeQuestionGroupService: ActiveQuestionGroupService) => {
      const id = 'panel-lobby';
      component.openTab(id);
      expect(document.getElementById(id).classList).toContain('show');
    }));
  });
});
