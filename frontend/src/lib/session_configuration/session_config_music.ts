import {DefaultSettings} from '../../app/service/settings.service';
import {IMusicSessionConfiguration, ITitleMusicSessionConfiguration, IVolumeMusicSessionConfiguration} from './interfaces';

class VolumeConfiguration implements IVolumeMusicSessionConfiguration {
  get useGlobalVolume(): boolean {
    return this._useGlobalVolume;
  }

  set useGlobalVolume(value: boolean) {
    this._useGlobalVolume = value;
  }

  get global(): number {
    return this._global;
  }

  set global(value: number) {
    this._global = value;
  }

  get lobby(): number {
    return this._lobby;
  }

  set lobby(value: number) {
    this._lobby = value;
  }

  get countdownRunning(): number {
    return this._countdownRunning;
  }

  set countdownRunning(value: number) {
    this._countdownRunning = value;
  }

  get countdownEnd(): number {
    return this._countdownEnd;
  }

  set countdownEnd(value: number) {
    this._countdownEnd = value;
  }

  private _global: number;
  private _lobby: number;
  private _countdownRunning: number;
  private _countdownEnd: number;
  private _useGlobalVolume: boolean;

  constructor({
                global = DefaultSettings.defaultSettings.music.volume.global,
                lobby = DefaultSettings.defaultSettings.music.volume.lobby,
                countdownRunning = DefaultSettings.defaultSettings.music.volume.countdownRunning,
                countdownEnd = DefaultSettings.defaultSettings.music.volume.countdownEnd,
                useGlobalVolume = DefaultSettings.defaultSettings.music.volume.useGlobal
              }) {
    this._global = global;
    this._lobby = lobby;
    this._countdownRunning = countdownRunning;
    this._countdownEnd = countdownEnd;
    this._useGlobalVolume = useGlobalVolume;
  }

  serialize(): Object {
    return {
      global: this.global,
      useGlobalVolume: this.useGlobalVolume,
      lobby: this.lobby,
      countdownRunning: this.countdownRunning,
      countdownEnd: this.countdownEnd
    }
  }
}

class TitleConfiguration implements ITitleMusicSessionConfiguration {
  get lobby(): string {
    return this._lobby;
  }

  set lobby(value: string) {
    this._lobby = value;
  }

  get countdownRunning(): string {
    return this._countdownRunning;
  }

  set countdownRunning(value: string) {
    this._countdownRunning = value;
  }

  get countdownEnd(): string {
    return this._countdownEnd;
  }

  set countdownEnd(value: string) {
    this._countdownEnd = value;
  }

  private _lobby: string;
  private _countdownRunning: string;
  private _countdownEnd: string;

  constructor({
                lobby = DefaultSettings.defaultSettings.music.title.lobby,
                countdownRunning = DefaultSettings.defaultSettings.music.title.countdownRunning,
                countdownEnd = DefaultSettings.defaultSettings.music.title.countdownEnd
              }) {
    this._lobby = lobby;
    this._countdownRunning = countdownRunning;
    this._countdownEnd = countdownEnd;
  }

  serialize(): Object {
    return {
      lobby: this.lobby,
      countdownRunning: this.countdownRunning,
      countdownEnd: this.countdownEnd
    }
  }
}

export class MusicSessionConfiguration implements IMusicSessionConfiguration {
  get volumeConfig(): IVolumeMusicSessionConfiguration {
    return this._volumeConfig;
  }

  set volumeConfig(value: IVolumeMusicSessionConfiguration) {
    this._volumeConfig = value;
  }

  get titleConfig(): ITitleMusicSessionConfiguration {
    return this._titleConfig;
  }

  set titleConfig(value: ITitleMusicSessionConfiguration) {
    this._titleConfig = value;
  }

  get lobbyEnabled(): boolean {
    return this._lobbyEnabled;
  }

  set lobbyEnabled(value: boolean) {
    this._lobbyEnabled = value;
  }

  get countdownRunningEnabled(): boolean {
    return this._countdownRunningEnabled;
  }

  set countdownRunningEnabled(value: boolean) {
    this._countdownRunningEnabled = value;
  }

  get countdownEndEnabled(): boolean {
    return this._countdownEndEnabled;
  }

  set countdownEndEnabled(value: boolean) {
    this._countdownEndEnabled = value;
  }

  private _volumeConfig: IVolumeMusicSessionConfiguration;
  private _titleConfig: ITitleMusicSessionConfiguration;
  private _lobbyEnabled: boolean;
  private _countdownRunningEnabled: boolean;
  private _countdownEndEnabled: boolean;

  constructor({
                volumeConfig = {},
                titleConfig = {},
                lobbyEnabled = DefaultSettings.defaultSettings.music.enabled.lobby,
                countdownRunningEnabled = DefaultSettings.defaultSettings.music.enabled.countdownRunning,
                countdownEndEnabled = DefaultSettings.defaultSettings.music.enabled.countdownEnd
              }) {
    this.volumeConfig = new VolumeConfiguration(volumeConfig);
    this.titleConfig = new TitleConfiguration(titleConfig);
    this.lobbyEnabled = lobbyEnabled;
    this.countdownRunningEnabled = countdownRunningEnabled;
    this.countdownEndEnabled = countdownEndEnabled;
  }

  serialize(): Object {
    return {
      enabled: {
        lobby: this.lobbyEnabled,
        countdownRunning: this.countdownRunningEnabled,
        countdownEnd: this.countdownEndEnabled
      },
      volumeConfig: this.volumeConfig.serialize(),
      titleConfig: this.titleConfig.serialize()
    };
  }

  equals(value: IMusicSessionConfiguration): boolean {
    return (
      this.volumeConfig.global === value.volumeConfig.global &&
      this.volumeConfig.lobby === value.volumeConfig.lobby &&
      this.volumeConfig.countdownRunning === value.volumeConfig.countdownRunning &&
      this.volumeConfig.countdownEnd === value.volumeConfig.countdownEnd &&

      this.titleConfig.lobby === value.titleConfig.lobby &&
      this.titleConfig.countdownRunning === value.titleConfig.countdownRunning &&
      this.titleConfig.countdownEnd === value.titleConfig.countdownEnd &&

      this.lobbyEnabled === value.lobbyEnabled &&
      this.countdownRunningEnabled === value.countdownRunningEnabled &&
      this.countdownEndEnabled === value.countdownEndEnabled
    );
  }
}
