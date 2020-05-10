import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DefaultSettings } from '../../../lib/default.settings';
import { MusicSessionConfigurationEntity } from '../../../lib/entities/session-configuration/MusicSessionConfigurationEntity';
import { StorageKey } from '../../../lib/enums/enums';
import { ISong } from '../../../lib/interfaces/ISong';
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

  get lobbySongs(): Array<ISong> {
    return this._lobbySongs;
  }

  private _countdownRunningSounds: Array<ISong> = [];

  get countdownRunningSounds(): Array<ISong> {
    return this._countdownRunningSounds;
  }

  private _countdownEndSounds: Array<ISong> = [];

  get countdownEndSounds(): Array<ISong> {
    return this._countdownEndSounds;
  }

  private _config: MusicSessionConfigurationEntity;

  get config(): MusicSessionConfigurationEntity {
    return this._config;
  }

  private _selected = 'lobby';
  private readonly _destroy = new Subject();

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
    });
  }

  public selectSound(target: 'lobby' | 'countdownRunning' | 'countdownEnd', event: Event): void {
    this.config.titleConfig[target] = (<HTMLSelectElement>event.target).value;
    this.toggleMusicPreview(target);
  }

  public openTab(id: string): void {
    this._selected = id;
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
  }

  public toString(value: number): string {
    return String(value);
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

  private toggleMusicPreview(target: 'lobby' | 'countdownRunning' | 'countdownEnd'): void {
    if (isPlatformBrowser(this.platformId)) {
      const audioElements = document.getElementsByTagName('audio');
      for (let i = 0; i < audioElements.length; i++) {
        (<HTMLAudioElement>audioElements.item(i)).volume = (parseInt(String(this.config.volumeConfig[target]), 10) || 60) / 100;
      }
    }
  }

  private resetSongList(): void {
    this._lobbySongs.splice(0, this._lobbySongs.length);
    this._countdownRunningSounds.splice(0, this._countdownRunningSounds.length);
    this._countdownEndSounds.splice(0, this._countdownEndSounds.length);
  }
}
