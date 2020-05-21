import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { RxStompService } from '@stomp/ng2-stompjs';
import { TranslatePipeMock } from '../../../../_mocks/_pipes/TranslatePipeMock';
import { AudioPlayerConfigTarget } from '../../../lib/enums/AudioPlayerConfigTarget';
import { jwtOptionsFactory } from '../../../lib/jwt.factory';
import { ConnectionMockService } from '../../../service/connection/connection.mock.service';
import { ConnectionService } from '../../../service/connection/connection.service';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizMockService } from '../../../service/quiz/quiz-mock.service';
import { QuizService } from '../../../service/quiz/quiz.service';
import { SettingsService } from '../../../service/settings/settings.service';
import { SharedService } from '../../../service/shared/shared.service';
import { StorageService } from '../../../service/storage/storage.service';
import { StorageServiceMock } from '../../../service/storage/storage.service.mock';
import { ThemesMockService } from '../../../service/themes/themes.mock.service';
import { ThemesService } from '../../../service/themes/themes.service';
import { TwitterService } from '../../../service/twitter/twitter.service';
import { TwitterServiceMock } from '../../../service/twitter/twitter.service.mock';
import { AudioPlayerComponent } from '../../../shared/audio-player/audio-player.component';
import { I18nTestingModule } from '../../../shared/testing/i18n-testing/i18n-testing.module';
import { SoundManagerComponent } from './sound-manager.component';

describe('SoundManagerComponent', () => {
  let component: SoundManagerComponent;
  let fixture: ComponentFixture<SoundManagerComponent>;

  beforeEach((
    () => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule, RouterTestingModule, HttpClientTestingModule, FormsModule, FontAwesomeModule, JwtModule.forRoot({
            jwtOptionsProvider: {
              provide: JWT_OPTIONS,
              useFactory: jwtOptionsFactory,
              deps: [PLATFORM_ID],
            },
          }),
        ],
        providers: [
          RxStompService, {
            provide: StorageService,
            useClass: StorageServiceMock,
          }, {
            provide: QuizService,
            useClass: QuizMockService,
          }, {
            provide: ThemesService,
            useClass: ThemesMockService
          }, FooterBarService, SettingsService, {
            provide: ConnectionService,
            useClass: ConnectionMockService,
          }, SharedService, {
            provide: TwitterService,
            useClass: TwitterServiceMock,
          },
        ],
        declarations: [
          SoundManagerComponent, TranslatePipeMock, AudioPlayerComponent,
        ],
      }).compileComponents();
    }
  ));

  beforeEach((
    () => {
      const library: FaIconLibrary = TestBed.inject(FaIconLibrary);
      library.addIcons(...[faStop, faPlay]);
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
    it('should select a given sound title', inject([QuizService], (quizService: QuizService) => {
      const value = 'Song1';
      const event = <any>{ target: { value } };
      quizService.quizUpdateEmitter.next(quizService.quiz);
      component.selectSound(AudioPlayerConfigTarget.lobby, event);
      expect(quizService.quiz.sessionConfig.music.titleConfig.lobby).toEqual(value);
    }));
  });

  describe('#openTab', () => {
    it('should open a config tab', inject([QuizService], (quizService: QuizService) => {
      const id = 'panel-lobby';
      component.openTab(id);
      expect(component.isSelected(id)).toBeTruthy();
    }));
  });
});
