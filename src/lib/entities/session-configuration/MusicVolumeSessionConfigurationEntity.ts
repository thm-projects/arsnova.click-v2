import { DefaultSettings } from '../../default.settings';

export class MusicVolumeSessionConfigurationEntity {
  public global: number = DefaultSettings.defaultQuizSettings.sessionConfig.music.volumeConfig.global;
  public lobby: number = DefaultSettings.defaultQuizSettings.sessionConfig.music.volumeConfig.lobby;
  public countdownRunning: number = DefaultSettings.defaultQuizSettings.sessionConfig.music.volumeConfig.countdownRunning;
  public countdownEnd: number = DefaultSettings.defaultQuizSettings.sessionConfig.music.volumeConfig.countdownEnd;
  public useGlobalVolume: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.music.volumeConfig.useGlobalVolume;

  constructor(props) {
    this.global = props.global;
    this.lobby = props.lobby;
    this.countdownRunning = props.countdownRunning;
    this.countdownEnd = props.countdownEnd;
    this.useGlobalVolume = props.useGlobalVolume;
  }
}
