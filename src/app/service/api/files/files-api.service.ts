import { Injectable } from '@angular/core';
import { DefaultSettings } from '../../../lib/default.settings';
import { AudioPlayerConfigTarget } from '../../../lib/enums/AudioPlayerConfigTarget';

@Injectable({
  providedIn: 'root',
})
export class FilesApiService {

  constructor() { }

  public SOUND_FILE_GET_URL(target: AudioPlayerConfigTarget, fileName: string): string {
    return `${DefaultSettings.httpApiEndpoint}/files/sound/${encodeURIComponent(target)}/${encodeURIComponent(fileName)}.mp3`;
  }
}
