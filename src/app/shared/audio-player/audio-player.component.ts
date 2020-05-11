import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { FilesApiService } from '../../service/api/files/files-api.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  public static readonly TYPE = 'AudioPlayerComponent';

  private _autostart: boolean;
  private _target: 'lobby' | 'countdownRunning' | 'countdownEnd';
  private _original_volume: string;
  private _src: string;
  private _loop = true;
  private _volume = '1';
  private _isPlaying = false;
  private readonly audioElement: HTMLAudioElement;

  @Output() public volumeChange = new EventEmitter();

  get autostart(): boolean {
    return this._autostart;
  }

  @Input() set autostart(value: boolean) {
    this._autostart = value;

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.audioElement.autoplay = value;
  }

  get target(): 'lobby' | 'countdownRunning' | 'countdownEnd' {
    return this._target;
  }

  @Input() set target(value: 'lobby' | 'countdownRunning' | 'countdownEnd') {
    this._target = value;

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.stopMusic();
    this.audioElement.src = this.getUrl();
  }

  @Input() set original_volume(value: string) {
    this._original_volume = value;
    this._volume = this._original_volume;
    if (this.audioElement) {
      this.audioElement.volume = (parseInt(this._volume, 10) || 0) / 100;
    }
  }

  get src(): string {
    return this._src;
  }

  @Input() set src(value: string) {
    this._src = value;

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.stopMusic();
    this.audioElement.src = this.getUrl();
  }

  get loop(): boolean {
    return this._loop;
  }

  @Input() set loop(value: boolean) {
    if (typeof value === 'undefined') {
      value = true;
    }
    this._loop = value ? true : null;

    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.audioElement.loop = this.loop;
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
    }
  }

  public getUrl(): string {
    return this.filesApiService.SOUND_FILE_GET_URL(this._target, this._src);
  }

  public playMusic(): void {
    if (this.audioElement.ended) {
      this.audioElement.currentTime = 0;
    }
    this.audioElement.play();
    this._isPlaying = true;
  }

  public pauseMusic(): void {
    this.audioElement.pause();
    this._isPlaying = false;
  }

  public stopMusic(): void {
    if (isPlatformServer(this.platformId)) {
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
  }

}
