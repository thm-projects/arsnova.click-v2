export declare interface IVolumeMusicSessionConfiguration {
  global: number;
  lobby: number;
  countdownRunning: number;
  countdownEnd: number;
  useGlobalVolume: boolean;

  serialize(): Object;
}

export declare interface ITitleMusicSessionConfiguration {
  lobby: string;
  countdownRunning: string;
  countdownEnd: string;

  serialize(): Object;
}

export declare interface IMusicSessionConfiguration {
  volumeConfig: IVolumeMusicSessionConfiguration;
  titleConfig: ITitleMusicSessionConfiguration;
  lobbyEnabled: boolean;
  countdownRunningEnabled: boolean;
  countdownEndEnabled: boolean;

  serialize(): any;

  equals(value: IMusicSessionConfiguration): boolean;
}

export declare interface INickSessionConfiguration {
  selectedNicks: Array<string>;
  blockIllegalNicks: boolean;
  restrictToCasLogin: boolean;

  serialize (): any;

  equals (value: INickSessionConfiguration): boolean;

  hasSelectedNick(nickname: string): boolean;

  toggleSelectedNick(nickname: string): void;

  addSelectedNick (newSelectedNick: string): void;

  removeSelectedNickByName (selectedNick: string): void;
}

export declare interface ISessionConfiguration {
  music: IMusicSessionConfiguration;
  nicks: INickSessionConfiguration;
  theme: string;
  readingConfirmationEnabled: boolean;
  showResponseProgress: boolean;
  confidenceSliderEnabled: boolean;

  equals (value: ISessionConfiguration): boolean;

  serialize (): ISessionConfiguration;
}
