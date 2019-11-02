import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ISong } from 'arsnova-click-v2-types/dist/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MusicSessionConfigurationEntity } from '../../../../lib/entities/session-configuration/MusicSessionConfigurationEntity';
import { StorageKey } from '../../../../lib/enums/enums';
import { FooterBarService } from '../../../service/footer-bar/footer-bar.service';
import { QuizService } from '../../../service/quiz/quiz.service';

@Component({
  selector: 'app-sound-manager',
  templateUrl: './sound-manager.component.html',
  styleUrls: ['./sound-manager.component.scss'],
})
export class SoundManagerComponent implements OnInit, OnDestroy {
  public static TYPE = 'SoundManagerComponent';

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

    this.quizService.loadDataToEdit(sessionStorage.getItem(StorageKey.CurrentQuizName));
  }

  public ngOnInit(): void {
    this.quizService.quizUpdateEmitter.pipe(takeUntil(this._destroy)).subscribe(quiz => {
      if (!quiz) {
        return;
      }

      this._config = this.quizService.quiz.sessionConfig.music;
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

  public setGlobalVolume($event): void {
    this.config.volumeConfig.global = parseInt((<HTMLInputElement>$event.target).value, 10);
  }

  public openTab(id: string): void {
    this._selected = id;
  }

  public isSelected(elem: string): boolean {
    return this._selected === elem;
  }

  public ngOnDestroy(): void {
    this.quizService.quiz.sessionConfig.music = this._config;
    this.quizService.persist();
    this._destroy.next();
    this._destroy.complete();
  }

  private initConfig(): void {
    this.config.titleConfig.lobby = this.config.titleConfig.lobby || 'Song0';
    this.config.titleConfig.countdownRunning = this.config.titleConfig.countdownRunning || 'Song0';
    this.config.titleConfig.countdownEnd = this.config.titleConfig.countdownEnd || 'Song0';
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
        (<HTMLAudioElement>audioElements.item(i)).volume = (this.config.volumeConfig[target] || 60) / 100;
      }
    }
  }

}
