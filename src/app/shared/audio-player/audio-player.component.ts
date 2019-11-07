import { AfterViewInit, Component, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID } from '@angular/core';
import { FilesApiService } from '../../service/api/files/files-api.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  public static TYPE = 'AudioPlayerComponent';
  @Output() public volumeChange = new EventEmitter();

  private _autostart: boolean;

  get autostart(): boolean {
    return this._autostart;
  }

  @Input() set autostart(value: boolean) {
    this._autostart = value;
    this.audioElement.autoplay = value;
  }

  private _target: 'lobby' | 'countdownRunning' | 'countdownEnd';

  get target(): 'lobby' | 'countdownRunning' | 'countdownEnd' {
    return this._target;
  }

  @Input() set target(value: 'lobby' | 'countdownRunning' | 'countdownEnd') {
    this._target = value;

    this.stopMusic();
    this.audioElement.src = this.getUrl();
  }

  private _original_volume: string;

  @Input() set original_volume(value: string) {
    this._original_volume = value;
    this._volume = this._original_volume;
    if (this.audioElement) {
      this.audioElement.volume = parseInt(this._volume, 10) / 100;
    }
  }

  private _src: string;

  get src(): string {
    return this._src;
  }

  @Input() set src(value: string) {
    this._src = value;

    this.stopMusic();
    this.audioElement.src = this.getUrl();
  }

  private _loop = true;

  get loop(): boolean {
    return this._loop;
  }

  @Input() set loop(value: boolean) {
    if (typeof value === 'undefined') {
      value = true;
    }
    this._loop = value ? true : null;

    this.audioElement.loop = this.loop;
  }

  private _volume = '1';

  get volume(): string {
    return this._volume;
  }

  set volume(value: string) {
    this._volume = value;
    this.volumeChange.emit(this.volume);
    this.audioElement.volume = parseInt(this.volume, 10) / 100;
  }

  private _isPlaying = false;

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  private readonly audioElement = new Audio();

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private filesApiService: FilesApiService) {
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
    this.audioElement.pause();
    this.audioElement.currentTime = 0;
    this._isPlaying = false;
  }

  public isStopped(): boolean {
    return (!this.audioElement.currentTime && this.audioElement.paused) || this.audioElement.ended;
  }

  public ngAfterViewInit(): void {
    this.audioElement.volume = parseInt(this._volume, 10) / 100;
  }

  public ngOnDestroy(): void {
    this.stopMusic();
  }

}
