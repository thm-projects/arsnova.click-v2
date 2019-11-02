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

  private _original_volume: number;

  @Input() set original_volume(value: number) {
    this._original_volume = value;
    this._volume = this._original_volume;
    if (this.audioElement) {
      this.audioElement.volume = this._volume / 100;
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

  private _volume = 1;

  get volume(): number {
    return this._volume;
  }

  private readonly audioElement = new Audio();
  private _isPlaying = false;

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

  public emitVolumeChange($event): void {
    this._volume = parseInt((<HTMLInputElement>$event.target).value, 10);
    this.volumeChange.emit(this._volume);
    this.audioElement.volume = this._volume / 100;
  }

  public ngAfterViewInit(): void {
    this.audioElement.volume = this._volume / 100;
  }

  public ngOnDestroy(): void {
    this.stopMusic();
  }

}
