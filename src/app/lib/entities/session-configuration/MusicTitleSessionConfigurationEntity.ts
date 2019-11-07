import { DefaultSettings } from '../../default.settings';

export class MusicTitleSessionConfigurationEntity {
  public lobby: string = DefaultSettings.defaultQuizSettings.sessionConfig.music.titleConfig.lobby;
  public countdownRunning: string = DefaultSettings.defaultQuizSettings.sessionConfig.music.titleConfig.countdownRunning;
  public countdownEnd: string = DefaultSettings.defaultQuizSettings.sessionConfig.music.titleConfig.countdownEnd;

  constructor(props) {
    this.lobby = props.lobby;
    this.countdownRunning = props.countdownRunning;
    this.countdownEnd = props.countdownEnd;
  }
}
