import { DefaultSettings } from '../../default.settings';
import { MusicSessionConfigurationEntity } from './MusicSessionConfigurationEntity';
import { NickSessionConfigurationEntity } from './NickSessionConfigurationEntity';

export class SessionConfigurationEntity {
  public music: MusicSessionConfigurationEntity;
  public nicks: NickSessionConfigurationEntity;
  public theme: string = DefaultSettings.defaultQuizSettings.sessionConfig.theme;
  public readingConfirmationEnabled: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.readingConfirmationEnabled;
  public showResponseProgress: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.showResponseProgress;
  public confidenceSliderEnabled: boolean = DefaultSettings.defaultQuizSettings.sessionConfig.confidenceSliderEnabled;

  constructor(props) {
    this.music = new MusicSessionConfigurationEntity(props.music);
    this.nicks = new NickSessionConfigurationEntity(props.nicks);
    this.theme = props.theme;
    this.readingConfirmationEnabled = props.readingConfirmationEnabled;
    this.showResponseProgress = props.showResponseProgress;
    this.confidenceSliderEnabled = props.confidenceSliderEnabled;
  }

  public equals(value: SessionConfigurationEntity): boolean {
    return this.music.equals(value.music) && this.nicks.equals(value.nicks) && this.theme === value.theme && this.readingConfirmationEnabled
           === value.readingConfirmationEnabled && this.showResponseProgress === value.showResponseProgress && this.confidenceSliderEnabled
           === value.confidenceSliderEnabled;
  }
}
