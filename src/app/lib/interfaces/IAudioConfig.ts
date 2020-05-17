export interface ISong {
  id: string;
  text: string;
}

export interface IAudioPlayerConfig {
  autostart: boolean;
  target: 'lobby' | 'countdownRunning' | 'countdownEnd';
  original_volume: string;
  src: string;
  loop?: boolean;
  hideControls?: boolean;
}
