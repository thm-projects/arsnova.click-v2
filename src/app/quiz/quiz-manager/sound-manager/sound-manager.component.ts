import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { MusicSessionConfigurationEntity } from '../../../lib/entities/session-configuration/MusicSessionConfigurationEntity';
import { AudioPlayerConfigTarget } from '../../../lib/enums/AudioPlayerConfigTarget';
import { StorageKey } from '../../../lib/enums/enums';
import { IAudioPlayerConfig, ISong } from '../../../lib/interfaces/IAudioConfig';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-sound-manager',
  templateUrl: './sound-manager.component.html',
  styleUrls: ['./sound-manager.component.scss'],
})
export class SoundManagerComponent implements OnInit, OnDestroy {
  public static readonly TYPE = 'SoundManagerComponent';

  private _lobbySongs: Array<ISong> = [];
  private _countdownRunningSounds: Array<ISong> = [];
  private _countdownEndSounds: Array<ISong> = [];
  private _config: MusicSessionConfigurationEntity;
  private _selected = 'lobby';
  private readonly _destroy = new Subject();
  public lobbyMusicConfig: IAudioPlayerConfig;
  public countdownRunningMusicConfig: IAudioPlayerConfig;
  public countdownEndMusicConfig: IAudioPlayerConfig;
  public readonly revalidate = new Subject();
  public readonly AudioPlayerConfigTarget = AudioPlayerConfigTarget;

  get lobbySongs(): Array<ISong> {
    return this._lobbySongs;
  }

  get countdownRunningSounds(): Array<ISong> {
    return this._countdownRunningSounds;
  }

  get countdownEndSounds(): Array<ISong> {
    return this._countdownEndSounds;
  }

  get config(): MusicSessionConfigurationEntity {
    return this._config;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService,
    private footerBarService: FooterBarService,
    private quizService: QuizService,
  ) {

    this.footerBarService.TYPE_REFERENCE = SoundManagerComponent.TYPE;
    footerBarService.replaceFooterElements([
      this.footerBarService.footerElemBack,
    ]);

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._config = this.quizService.quiz.sessionConfig.music;
      this.resetSongList();

      this.initConfig();
      this.setLobbySongs();
      this.setRandomKey();
      this.setCountdownRunningSongs();
      this.setCountdownEndSongs();
      this.updateAudioSource();
    });
  }

  public selectSound(target: AudioPlayerConfigTarget, event: Event): void {
    this.config.titleConfig[target] = (<HTMLSelectElement>event.target).value;
    this.updateAudioSource();
  }

  public openTab(id: string): void {
    this._selected = id;
    this.updateAudioSource();
  }

  public isSelected(elem: string): boolean {
    return this._selected === elem;
  }

  public ngOnDestroy(): void {
    if (this.quizService.quiz) {
      this.quizService.quiz.sessionConfig.music = this._config;
      this.quizService.persist();
    }
    this._destroy.next();
    this._destroy.complete();
    this.revalidate.complete();
  }

  public toggleGlobalVolume(): void {
    this.config.volumeConfig.useGlobalVolume = !this.config?.volumeConfig.useGlobalVolume;
    this.updateAudioVolume();
  }

  public updateAudioVolume(value?: string): void {
    const volumeConfig = this.config?.volumeConfig;
    if (value) {
      volumeConfig.global = parseInt(value, 10);
    }

    this.lobbyMusicConfig.original_volume = String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.lobby);
    this.countdownRunningMusicConfig.original_volume = String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.countdownRunning);
    this.countdownEndMusicConfig.original_volume = String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.countdownEnd);

    this.revalidate.next();
  }

  private initConfig(): void {
    const defaultConfig = DefaultSettings.defaultQuizSettings.sessionConfig.music.titleConfig;

    this.config.titleConfig.lobby = this.config.titleConfig.lobby || defaultConfig.lobby;
    this.config.titleConfig.countdownRunning = defaultConfig.countdownRunning;
    this.config.titleConfig.countdownEnd = defaultConfig.countdownEnd;
  }

  private setCountdownEndSongs(): void {
    this._countdownEndSounds.push({
      id: 'Song0',
      text: this.translateService.instant('plugins.sound.whistle'),
    });
    this._countdownEndSounds.push({
      id: 'Song1',
      text: 'Chinese Gong',
    });
  }

  private setCountdownRunningSongs(): void {
    this._countdownRunningSounds.push({
      id: 'Song0',
      text: 'Relax mood: "The Lounge" | Bensound.com',
    });
    this._countdownRunningSounds.push({
      id: 'Song1',
      text: 'Ukulele: "Cute" | Bensound.com',
    });
    this._countdownRunningSounds.push({
      id: 'Song2',
      text: 'Driving tune: "Epic" | Bensound.com',
    });
  }

  private setLobbySongs(): void {
    this._lobbySongs.push({
      id: 'Song0',
      text: 'Happy & fun mood: "Clear day" | Bensound.com',
    });
    this._lobbySongs.push({
      id: 'Song1',
      text: 'House music: "House" | Bensound.com',
    });
    this._lobbySongs.push({
      id: 'Song2',
      text: 'Gypsy french jazz: "Jazzy frenchy" | Bensound.com',
    });
    this._lobbySongs.push({
      id: 'Song3',
      text: 'Childish: "Little idea" | Bensound.com',
    });
  }

  private setRandomKey(): void {
    const value = this.translateService.instant('plugins.sound.random');
    this._lobbySongs.push({
      id: 'Random',
      text: value,
    });
    this._countdownRunningSounds.push({
      id: 'Random',
      text: value,
    });
    this._countdownEndSounds.push({
      id: 'Random',
      text: value,
    });
  }

  private resetSongList(): void {
    this._lobbySongs.splice(0, this._lobbySongs.length);
    this._countdownRunningSounds.splice(0, this._countdownRunningSounds.length);
    this._countdownEndSounds.splice(0, this._countdownEndSounds.length);
  }

  private updateAudioSource(): void {
    const volumeConfig = this.config?.volumeConfig;

    this.lobbyMusicConfig = {
      autostart: false,
      src: this.config?.titleConfig?.lobby,
      target: AudioPlayerConfigTarget.lobby,
      loop: true,
      original_volume: String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.lobby)
    };

    this.countdownRunningMusicConfig = {
      autostart: false,
      src: this.config?.titleConfig?.countdownRunning,
      target: AudioPlayerConfigTarget.countdownRunning,
      loop: true,
      original_volume: String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.countdownRunning)
    };

    this.countdownEndMusicConfig = {
      autostart: false,
      src: this.config?.titleConfig?.countdownEnd,
      target: AudioPlayerConfigTarget.countdownEnd,
      original_volume: String(volumeConfig.useGlobalVolume ? volumeConfig.global : volumeConfig.countdownEnd)
    };
  }
}
