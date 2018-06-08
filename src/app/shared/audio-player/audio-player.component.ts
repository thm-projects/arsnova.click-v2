import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FilesApiService } from '../../service/api/files/files-api.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements AfterViewInit {
  public static TYPE = 'AudioPlayerComponent';

  @Output() public volumeChange = new EventEmitter();

  @Input() public autostart: boolean;

  private _target: 'lobby' | 'countdownRunning' | 'countdownEnd';
  @Input()
  set target(value: 'lobby' | 'countdownRunning' | 'countdownEnd') {
    this._target = value;
  }

  private _original_volume: number;
  @Input()
  set original_volume(value: number) {
    this._original_volume = value;
    this._volume = this._original_volume;
    if (this.getAudioElement()) {
      this._audioElement.volume = this._volume / 100;
    }
  }

  private _src: string;

  @Input()
  set src(value: string) {
    this._src = value;
  }

  private _loop = true;

  get loop(): boolean {
    return this._loop;
  }

  @Input()
  set loop(value: boolean) {
    if (typeof value === 'undefined') {
      value = true;
    }
    this._loop = value ? true : null;
  }

  private _volume = 1;

  get volume(): number {
    return this._volume;
  }

  private _randomUUID = `audio-player-${Math.random()}`;

  get randomUUID(): string {
    return this._randomUUID;
  }

  private _audioElement: HTMLAudioElement;
  private _isPlaying = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private filesApiService: FilesApiService,
  ) {
  }

  public getUrl(): string {
    return this.filesApiService.SOUND_FILE_GET_URL(this._target, this._src);
  }

  public playMusic(): void {
    this.getAudioElement();
    if (this._audioElement.ended) {
      this._audioElement.currentTime = 0;
    }
    this._audioElement.play();
    this._isPlaying = true;
  }

  public pauseMusic(): void {
    this.getAudioElement();
    this._audioElement.pause();
    this._isPlaying = false;
  }

  public stopMusic(): void {
    this.getAudioElement();
    this._audioElement.pause();
    this._audioElement.currentTime = 0;
    this._isPlaying = false;
  }

  public isStopped(): boolean {
    if (!this.getAudioElement()) {
      return true;
    }
    return (!this._audioElement.currentTime && this._audioElement.paused) || this._audioElement.ended;
  }

  public emitVolumeChange($event): void {
    this._volume = parseInt((<HTMLInputElement>$event.target).value, 10);
    this.volumeChange.emit(this._volume);
    this.getAudioElement();
    this._audioElement.volume = this._volume / 100;
  }

  public ngAfterViewInit(): void {
    this.getAudioElement();
    this._audioElement.volume = this._volume / 100;
  }

  private getAudioElement(): HTMLAudioElement {
    if (isPlatformBrowser(this.platformId) && !this._audioElement) {
      this._audioElement = <HTMLAudioElement>document.getElementById(this._randomUUID);
    }
    return this._audioElement;
  }

}
