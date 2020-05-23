import { AudioPlayerConfigTarget } from '../enums/AudioPlayerConfigTarget';

export interface ISong {
  id: string;
  text: string;
}

export interface IAudioPlayerConfig {
  autostart: boolean;
  target: AudioPlayerConfigTarget;
  original_volume: string;
  src: string;
  loop?: boolean;
  hideControls?: boolean;
}
