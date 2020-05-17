import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IAudioPlayerConfig } from '../../lib/interfaces/IAudioConfig';
import { FilesApiService } from '../../service/api/files/files-api.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  public static readonly TYPE = 'AudioPlayerComponent';

  private _config: IAudioPlayerConfig;
  private _volume = '1';
  private _isPlaying = false;
  private _autostartRejected: boolean;
  private _revalidate: Subscription;
  private readonly _destroy = new Subject();
  private readonly audioElement: HTMLAudioElement;

  get autostartRejected(): boolean {
    return this._autostartRejected;
  }

  @Output() public volumeChange = new EventEmitter();
  @Output() public playbackFinished = new EventEmitter();

  @Input() set revalidate(value: Subject<void>) {
    if (this._revalidate) {
      this._revalidate.unsubscribe();
    }

    this._revalidate = value.pipe(takeUntil(this._destroy)).subscribe(() => {
      this._config.autostart = this.isPlaying;
      this._volume = this._config.original_volume;
      this.audioElement.volume = (parseInt(this._volume, 10) || 0) / 100;
    });
  }

  @Input() set config(value: IAudioPlayerConfig) {
    this._config = value;

    if (!value) {
      return;
    }

    this._volume = this._config.original_volume;

    this.loadAudioElement();
  }

  get config(): IAudioPlayerConfig {
    return this._config;
  }

  get volume(): string {
    return this._volume;
  }

  set volume(value: string) {
    this._volume = value;
    this.volumeChange.emit(this.volume);
    this.audioElement.volume = (parseInt(this._volume, 10) || 0) / 100;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private filesApiService: FilesApiService) {
    if (isPlatformBrowser(this.platformId)) {
      this.audioElement = new Audio();
      this.audioElement.addEventListener('ended', () => {
        this.playbackFinished.next();
        this.stopMusic();
      });
    }
  }

  public ngOnInit(): void {
  }

  public getUrl(): string {
    return this.filesApiService.SOUND_FILE_GET_URL(this._config.target, this._config.src);
  }

  public playMusic(): void {
    this._autostartRejected = false;
    if (this.audioElement.ended) {
      this.audioElement.currentTime = 0;
    }
    this.audioElement.play().catch(() => {
      // Autoplay was prevented - "NotAllowedError: play() failed because the user didn't interact with the document first. https://goo.gl/xX8pDD"
      this._autostartRejected = true;
    });
    this._isPlaying = true;
  }

  public pauseMusic(): void {
    this.audioElement.pause();
    this._isPlaying = false;
  }

  public stopMusic(): void {
    if (isPlatformServer(this.platformId) || !this.audioElement) {
      return;
    }

    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this._isPlaying = false;
  }

  public isStopped(): boolean {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    return (!this.audioElement.currentTime && this.audioElement.paused) || this.audioElement.ended;
  }

  public ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.audioElement.volume = (parseInt(this._volume, 10) || 0) / 100;
  }

  public ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopMusic();
    }

    this._destroy.next();
    this._destroy.complete();
  }

  private loadAudioElement(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.audioElement.autoplay = this._config.autostart;
    this.audioElement.src = this.getUrl();
    this.audioElement.volume = (parseInt(this._volume, 10) || 0) / 100;
    this.audioElement.loop = this.config.loop;

    if (this._config.autostart && !this.isPlaying) {
      this.playMusic();
    } else {
      this.stopMusic();
    }
  }

}
